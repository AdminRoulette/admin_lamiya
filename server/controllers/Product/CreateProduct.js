const TelegramMsg = require("../../functions/TelegramMsg");
const apiError = require("../../error/apierror");
const {
    Category,
    Brand,
    Country,
    Device,
    DeviceImage,
    DeviceOptions,
    Product_Category,
    ParfumePart,
    BodyCarePart,
    PriceTags, StockHistory,
    FilterValues, Filters, FilterProductValue, SimilarDevices
} = require("../../models/models");
const S3 = require("aws-sdk/clients/s3");
const {Op} = require("sequelize");
const stockEmail = require("../../functions/Emails/stockEmail");
const GenerateRandomCode = require("../../functions/Product/GenerateRandomCode");
const Transliterations = require("../../functions/SearchComponents/Transliterations");
const CalculateSellBottlePrice = require("../../functions/Product/CalculateSellBottlePrice");
const UpdateStock = require("../../functions/Product/UpdateStock");
const UploadImages = require("../../functions/Product/UploadImagesToAWS");
const axios = require("axios");
const accessKeyId = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

class CreateProduct {

    async getUpdateProductInfo(req, res, next) {
        try {
            const {id} = req.params;
            let DeviceElem = await Device.findOne({
                where: {id},
                order: [[DeviceOptions, "index", "ASC"], [DeviceOptions, DeviceImage, "index", "ASC"], [Product_Category, 'category', "level", "ASC"], [Product_Category, "id", "ASC"]],
                include: [{model: Brand, attributes: ["id", 'name', 'name_ru']}, {
                    model: Product_Category, attributes: ["id", 'categoryId'], include: [{
                        model: Category, attributes: ["id", 'level', 'name', 'code'], as: 'category', include: [{
                            model: Category, attributes: ["id", 'level', 'name', 'code'], as: 'parent', include: [{
                                model: Category, attributes: ["id", 'level', 'name', 'code'], as: 'parent', include: [{
                                    model: Category,
                                    attributes: ["id", 'level', 'name', 'code'],
                                    as: 'parent',
                                    include: [{
                                        model: Category, attributes: ["id", 'level', 'name', 'code'], as: 'parent'
                                    }]
                                }]
                            }]
                        }]
                    }]
                },
                    {
                        include: [{model: DeviceOptions,attributes:["id"], limit:1,
                            include: [{model: DeviceImage,attributes:['image'] , limit:1}]
                        }],
                        model: Device,
                        attributes:['name','id'],
                        as: 'similarDevices',
                        through: { attributes: [] },
                    },
                    {
                        model: DeviceOptions,
                        include: [{model: DeviceImage, attributes: ["image", 'id', 'index', 'option_id']}]
                    }]
            });

            const groupedMap = new Map();

            const filter_values = await FilterValues.findAll({
                include: [{
                    model: Filters
                }, {
                    model: Device,
                    required: true,
                    attributes: [],
                    through: {attributes: ['id']},
                    where: {id: id}
                }],
                raw: true
            })

            for (const val of filter_values) {
                const filterCode = val['filter.code'];
                if (!groupedMap.has(filterCode)) {
                    groupedMap.set(filterCode, {
                        id: val.filter_id,
                        code: filterCode,
                        name: val['filter.name'],
                        values: []
                    });

                }
                groupedMap.get(filterCode).values.push({
                    product_value_id: val['devices.filter_product_value.id'],
                    id: val.id,
                    code: val.code,
                    name: val.name,
                    name_ru: val.name_ru,
                });
            }

            return res.json({
                id: DeviceElem.id,
                brand: DeviceElem.brand,
                name: DeviceElem.name,
                name_ru: DeviceElem.name_ru,
                hit: DeviceElem.hit,
                active: DeviceElem.active,
                tags: DeviceElem.tags,
                tags_ru: DeviceElem.tags_ru,
                status: DeviceElem.status,
                weekdiscount: DeviceElem.weekdiscount,
                newImage: [],
                disc: DeviceElem.disc,
                disc_ru: DeviceElem.disc_ru,
                country: DeviceElem.country,
                series: DeviceElem.series,
                series_ru: DeviceElem.series_ru,
                deviceoptions: DeviceElem.deviceoptions,
                product_categories: DeviceElem.product_categories,
                filters: [...groupedMap.values()],
                similarDevices: DeviceElem.similarDevices,
                parfumepart: DeviceElem.parfumepart,
                bodycarepart: DeviceElem.bodycarepart
            });
        } catch (e) {
            TelegramMsg("TECH", `getUpdateProductInfo ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async create(req, res, next) {
        try {
            const {
                name,
                series,
                name_ru,
                series_ru,
                disc,
                status,
                disc_ru,
                countryId,
                tags,
                tags_ru,
                on_tab_price,
                composition,
                applicationmethod,
                activecomponents,
                applicationmethod_ru,
                activecomponents_ru
            } = req.body;
            let options = JSON.parse(req.body.options)
            let fileIndex = 0;
            for (const option of options) {
                for (const img of option.deviceimages) {
                    if (img.file) {
                        const file = req.files[fileIndex++];
                        if (file) {
                            img.file = file;
                        }
                    }
                }
            }
            const brand = JSON.parse(req.body.brand)
            const active = JSON.parse(req.body.active)
            const refund_count = Number(req.body.refund_count)
            const partcount = Number(req.body.partcount)
            const hit = JSON.parse(req.body.hit)
            const weekdiscount = JSON.parse(req.body.weekdiscount)
            const categories = JSON.parse(req.body.categories)
            const filters = req.body.filters && JSON.parse(req.body.filters)
            const similars = JSON.parse(req.body.similar)
            const formattedLink = await Transliterations(`${name}-${series}`);

            const checkLink = await Device.findOne({where: {link: formattedLink}});
            let stock = false;

            if (checkLink) {
                return next(apiError.badRequest("Товар з таким посиланням вже існує"));
            }

            async function uploadImage(index, device_id, option_id, file) {
                const fileName = `${option_id}-hq-` + await GenerateRandomCode(4) + ".webp"
                await UploadImages({
                    name: fileName,
                    basket: `lamiya/images/${device_id}`,
                    file,
                    size: 480
                })
                await DeviceImage.create({
                    image: `https://lamiya.s3.amazonaws.com/images/${device_id}/${fileName}`,
                    option_id: option_id,
                    index: index
                })
            }


            const elem = await Device.create({
                active,
                weekdiscount,
                hit,
                name,
                status,
                name_ru,
                series_ru,
                brandId: brand.id,
                disc_ru,
                disc,
                tags_ru,
                tags,
                countryId,
                series,
                link: formattedLink
            })
            if (categories) {
                for (const category of categories) {
                    await Product_Category.create({productId: elem.id, categoryId: category.id})
                }
            }

            if (categories.some(item => item.id === 60)) {
                await ParfumePart.create({
                    partcount, on_tab_price, refund_count, deviceId: elem.id
                })
            } else {
                await BodyCarePart.create({
                    composition,
                    applicationmethod,
                    activecomponents,
                    applicationmethod_ru,
                    activecomponents_ru,
                    deviceId: elem.id
                })
            }
            if (options) {
                const totalMilliliters = (refund_count + partcount);
                for (const item of options) {
                    if (!stock && item.count > 0) {
                        stock = true;
                    }
                    await DeviceOptions.create({
                        deviceId: elem.id,
                        optionName: item.sell_type === "sell_bottle" ? `Залишок у флаконі ${partcount} мл` : item.optionName,
                        optionName_ru: item.sell_type === "sell_bottle" ? `Остаток во флаконе ${partcount} мл` : item.optionName_ru,
                        gtin: item.gtin,
                        index: Number(item.index),
                        marketPrice: Number(item.marketPrice),
                        marketPromoPrice: Number(item.marketPromoPrice),
                        marketOldPrice: Number(item.marketOldPrice),
                        startPrice: item.sell_type === "sell_bottle" ? partcount * on_tab_price : Number(item.startPrice),
                        weight: item.sell_type === "sell_bottle" ? partcount : !isNaN(parseFloat(item.weight)) ? parseFloat(item.weight) : 0,
                        price: item.sell_type === "sell_bottle" ? await CalculateSellBottlePrice(on_tab_price, partcount) : Number(item.price),
                        saleprice: Number(item.saleprice),
                        count: item.sell_type === "on_tab" ? Math.floor(totalMilliliters / parseFloat(item.weight)) : item.sell_type === "sell_bottle" ? (partcount > 0 ? 1 : 0) : Number(item.count),
                        sell_type: item.sell_type,
                        code: item.code,
                    }).then(async (option) => {
                        await StockHistory.create({
                            option_id: option.id,
                            order_id: null,
                            old_count: null,
                            new_count: option.count,
                            user_id: req.user.id,
                            action: "Створення товару",
                        })
                        if (!categories.some(item => item.id === 60)) {
                            await PriceTags.create({
                                option_id: option.id,
                                shop_id: 1,
                                type: "Новий товар"
                            });
                        }
                        for (const img of item.deviceimages) {
                            await uploadImage(img.index, elem.id, option.id, img.file);
                        }
                        await axios.put(`http://localhost:9200/options/_doc/${option.id}`, {
                            option_id: +option.id,
                            product_id: elem.id,
                            product_name: `${name} ${series} ${option.optionName}`.toLowerCase(),
                            product_name_ru: `${name_ru} ${series_ru} ${option.optionName_ru}`.toLowerCase(),
                            product_tags: tags.toLowerCase().split(","),
                            product_tags_ru: tags_ru.toLowerCase().split(","),
                            codes: item.code.split(',').filter(Boolean)
                        }, {
                            auth: {
                                username: 'elasticuser',
                                password: process.env.ELASTIC_PASS,
                            },
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).catch(() => {
                        });
                    })
                }
                await Device.update({stock: stock}, {where: {id: elem.id}});
            }

            //similar
            if(similars){
                await SimilarDevices.bulkCreate(
                    similars.map(similarId => ({ deviceId: elem.id, similarId }))
                );
            }

            //----update filters
            const allFiltersValues = filters.flatMap(item => item.values);
            for (const createItem of allFiltersValues) {
                await FilterProductValue.findOrCreate({where: {filter_value_id: createItem.id, product_id: elem.id}})
            }

            await axios.put(`http://localhost:9200/products/_doc/${elem.id}`, {
                product_id: +elem.id,
                name: `${name} ${series}`.toLowerCase(),
                name_ru: `${name_ru} ${series_ru}`.toLowerCase(),
                tags: tags.toLowerCase().split(","),
                tags_ru: tags_ru.toLowerCase().split(","),
                codes: options.flatMap(opt => opt.code.split(',').filter(Boolean).map(c => c.split('-')[1].toLowerCase())),
                filters: allFiltersValues.map(v => v.name).join(' ').toLowerCase(),
                filters_ru: allFiltersValues.map(v => v.name_ru).join(' ').toLowerCase(),
                original: categories.some(item => item.id === 60),
                active: active,
                stock: stock
            }, {
                auth: {
                    username: 'elasticuser',
                    password: process.env.ELASTIC_PASS,
                }
            }).catch(() => {
            });

            UpdateStock([elem.id])
            return res.json(elem.id);

        } catch (e) {
            TelegramMsg("TECH", `create product ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }


    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {
                name,
                series,
                name_ru,
                series_ru,
                company,
                disc,
                disc_ru,
                tags_ru,
                tags,
                status,
                countryId,
                composition,
                applicationmethod,
                activecomponents,
                applicationmethod_ru,
                activecomponents_ru
            } = req.body;
            let options = JSON.parse(req.body.options)
            let fileIndex = 0;
            for (const option of options) {
                for (const img of option.deviceimages) {
                    if (img.file) {
                        const file = req.files[fileIndex++];
                        if (file) {
                            img.file = file;
                        }
                    }
                }
            }
            const brand = JSON.parse(req.body.brand)
            const partcount = Number(req.body.partcount)
            const refund_count = Number(req.body.refund_count)
            const on_tab_price = Number(req.body.on_tab_price)
            const active = JSON.parse(req.body.active)
            const hit = JSON.parse(req.body.hit)
            const weekdiscount = JSON.parse(req.body.weekdiscount)
            const categories = JSON.parse(req.body.categories)
            const similars = JSON.parse(req.body.similar)
            const filters = req.body.filters && JSON.parse(req.body.filters)

            let stock = refund_count > 3 || partcount > 3;

            async function uploadImage(index, option_id, file) {
                const fileName = `${option_id}-hq-` + await GenerateRandomCode(4) + ".webp"
                await UploadImages({
                    name: fileName,
                    basket: `lamiya/images/${id}`,
                    file,
                    size: 480
                })
                await DeviceImage.create({
                    image: `https://lamiya.s3.amazonaws.com/images/${id}/${fileName}`,
                    option_id: option_id,
                    index: index
                })
            }

            if (categories) {
                const existingRecords = await Product_Category.findAll({where: {productId: id}})
                const existingRecordsMap = new Map(existingRecords.map(record => [record.id, record]));
                const newCategoriesIds = new Set(categories.map(record => record.id));
                for (const newRecord of categories) {
                    if (!existingRecordsMap.has(newRecord.id)) {
                        await Product_Category.create({productId: id, categoryId: newRecord.id});
                    }
                }
                for (const record of existingRecords) {
                    if (!newCategoriesIds.has(record.id)) {
                        await Product_Category.destroy({where: {id: record.id}});
                    }
                }
            }
            await Device.findOne({where: {id}})
                .then(async data => {
                    if (data) {
                        if (options) {
                            const totalMilliliters = (Number(refund_count) + Number(partcount));
                            const existingRecords = await DeviceOptions.findAll({where: {deviceId: id}});
                            const existingRecordsMap = new Map(existingRecords.map(record => [record.id, record]));
                            for (const item of options) {
                                const count = item.sell_type === "on_tab" ? Math.floor(totalMilliliters / parseFloat(item.weight)) : item.sell_type === "sell_bottle" ? (partcount > 0 ? 1 : 0) : Number(item.count)
                                if (!stock && count > 0) {
                                    stock = true;
                                }
                                if (item.id && existingRecordsMap.has(item.id)) {
                                    const oldRecord = existingRecordsMap.get(item.id)
                                    if (oldRecord.price !== Number(item.price)) {
                                        TelegramMsg("TECH", `Зміна ціни id:${data.id}`)
                                        if (!categories.some(item => item.id === 60)) {
                                            await PriceTags.create({
                                                option_id: item.id,
                                                shop_id: 1,
                                                type: "Зміна ціни"
                                            });
                                        }
                                    }
                                    if (oldRecord.count !== count) {
                                        await StockHistory.create({
                                            option_id: oldRecord.id,
                                            order_id: null,
                                            old_count: oldRecord.count,
                                            new_count: count,
                                            user_id: req.user.id,
                                            action: "Редагування товару",
                                        })
                                    }

                                    await DeviceOptions.update({
                                        optionName: item.sell_type === "sell_bottle" ? `Залишок у флаконі ${partcount} мл` : item.optionName,
                                        optionName_ru: item.sell_type === "sell_bottle" ? `Остаток во флаконе ${partcount} мл` : item.optionName_ru,
                                        gtin: item.gtin,
                                        index: Number(item.index),
                                        marketPrice: Number(item.marketPrice),
                                        marketPromoPrice: Number(item.marketPromoPrice),
                                        marketOldPrice: Number(item.marketOldPrice),
                                        startPrice: item.sell_type === "sell_bottle" ? partcount * on_tab_price : Number(item.startPrice),
                                        weight: item.sell_type === "sell_bottle" ? partcount : !isNaN(parseFloat(item.weight)) ? parseFloat(item.weight) : 0,
                                        price: item.sell_type === "sell_bottle" ? await CalculateSellBottlePrice(on_tab_price, partcount) : Number(item.price),
                                        saleprice: Number(item.saleprice),
                                        count: count,
                                        sell_type: item.sell_type,
                                        code: item.code,
                                    }, {where: {id: item.id}})

                                    if (item.deviceimages?.length > 0) {
                                        const existingImages = await DeviceImage.findAll({
                                            where: {option_id: item.id}
                                        });
                                        const existingImageMap = new Map(existingImages.map(img => [img.id, img]));

                                        for (let i = 0; i < item.deviceimages.length; i++) {
                                            const existingImage = existingImageMap.get(item.deviceimages[i].id);

                                            if (!existingImage) {
                                                await uploadImage(item.deviceimages[i].index, item.deviceimages[i].option_id, item.deviceimages[i].file)
                                            } else if (existingImage.index !== item.deviceimages[i].index) {
                                                DeviceImage.update({index: item.deviceimages[i].index}, {where: {id: existingImage.id}})
                                            }
                                        }

                                        const imagesToDelete = existingImages.filter(img => !new Set(item.deviceimages.map(i => i.id)).has(img.id));
                                        if (imagesToDelete) {
                                            for (const deleteImg of imagesToDelete) {
                                                await DeviceImage.destroy({where: {id: deleteImg.id}}).then(() => {
                                                    let s3Link = deleteImg.image.split("https://lamiya.s3.amazonaws.com/")[1];
                                                    const s3 = new S3({
                                                        region: 'eu-central-1', accessKeyId, secretAccessKey
                                                    })
                                                    s3.deleteObject({
                                                        Bucket: `lamiya`, Key: s3Link
                                                    }, function (err, data) {
                                                    })
                                                    s3.deleteObject({
                                                        Bucket: "lamiya", Key: s3Link.replace(".webp", ".jpg")
                                                    }, function (err, data) {
                                                    })
                                                    s3.deleteObject({
                                                        Bucket: "lamiya", Key: s3Link.replace("-hq-", "-lq-")
                                                    }, function (err, data) {
                                                    })
                                                })
                                            }
                                        }
                                    }


                                    await axios.put(`http://localhost:9200/options/_doc/${item.id}`, {
                                        option_id: +item.id,
                                        product_id: id,
                                        product_name: `${brand.name} ${name} ${series} ${item.optionName}`.toLowerCase(),
                                        product_name_ru: `${brand.name_ru} ${name_ru} ${series_ru} ${item.optionName_ru}`.toLowerCase(),
                                        product_tags: tags.toLowerCase().split(","),
                                        product_tags_ru: tags_ru.toLowerCase().split(","),
                                        codes: item.code.split(',').filter(Boolean)
                                    }, {
                                        auth: {
                                            username: 'elasticuser',
                                            password: process.env.ELASTIC_PASS,
                                        },
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    }).catch(() => {
                                    });
                                } else {
                                    await DeviceOptions.create({
                                        deviceId: id,
                                        optionName: item.sell_type === "sell_bottle" ? `Залишок у флаконі ${partcount} мл` : item.optionName,
                                        optionName_ru: item.sell_type === "sell_bottle" ? `Остаток во флаконе ${partcount} мл` : item.optionName_ru,
                                        gtin: item.gtin,
                                        index: Number(item.index),
                                        marketPrice: Number(item.marketPrice),
                                        marketPromoPrice: Number(item.marketPromoPrice),
                                        marketOldPrice: Number(item.marketOldPrice),
                                        startPrice: item.sell_type === "sell_bottle" ? partcount * on_tab_price : Number(item.startPrice),
                                        weight: item.sell_type === "sell_bottle" ? partcount : !isNaN(parseFloat(item.weight)) ? parseFloat(item.weight) : 0,
                                        price: item.sell_type === "sell_bottle" ? await CalculateSellBottlePrice(on_tab_price, partcount) : Number(item.price),
                                        saleprice: Number(item.saleprice),
                                        count: count,
                                        sell_type: item.sell_type,
                                        code: item.code,
                                    }).then(async option => {
                                        await StockHistory.create({
                                            option_id: option.id,
                                            order_id: null,
                                            old_count: null,
                                            new_count: option.count,
                                            user_id: req.user.id,
                                            action: "Створення товару",
                                        })
                                        for (const img of item.deviceimages) {
                                            await uploadImage(img.index, option.id, img.file)
                                        }


                                        await axios.put(`http://localhost:9200/options/_doc/${option.id}`, {
                                            option_id: +option.id,
                                            product_id: id,
                                            product_name: `${name} ${series} ${item.optionName}`.toLowerCase(),
                                            product_name_ru: `${name_ru} ${series_ru} ${item.optionName_ru}`.toLowerCase(),
                                            product_tags: tags.toLowerCase().split(","),
                                            product_tags_ru: tags_ru.toLowerCase().split(","),
                                            codes: item.code.split(',').filter(Boolean)
                                        }, {
                                            auth: {
                                                username: 'elasticuser',
                                                password: process.env.ELASTIC_PASS,
                                            },
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        }).catch(() => {
                                        });
                                    })
                                }
                            }
                            await Device.update({stock: stock}, {where: {id: id}});
                        }

                        if (categories.some(item => item.id === 60)) {
                            await ParfumePart.update({
                                partcount,
                                on_tab_price,
                                refund_count
                            }, {where: {deviceId: id}})
                        } else if (categories.every(item => item.id !== 106)) {
                            await BodyCarePart.update({
                                composition,
                                applicationmethod,
                                activecomponents,
                                applicationmethod_ru,
                                activecomponents_ru,
                                deviceId: data.id
                            }, {where: {deviceId: id}})
                        }

                        //similar products

                        const allSimilars = await SimilarDevices.findAll({
                            where: { deviceId: id },
                            attributes: ['similarId'],
                            raw: true
                        });
                        const similarIds = allSimilars.map(s => s.similarId);
                        const toAddSimilars = similars.filter(id => !similarIds.includes(id));
                        const toDeleteSimilars = similarIds.filter(id => !similars.includes(id));
                        if (toAddSimilars.length) {
                            await SimilarDevices.bulkCreate(
                                toAddSimilars.map(similarId => ({ deviceId: id, similarId }))
                            );
                        }
                        if (toDeleteSimilars.length) {
                            await SimilarDevices.destroy({
                                where: {
                                    deviceId: id,
                                    similarId: toDeleteSimilars
                                }
                            });
                        }

                        //----update filters
                        const allFiltersValues = filters.flatMap(item => item.values);
                        const existingRecords = await FilterProductValue.findAll({where: {product_id: id}});
                        const existingIds = existingRecords.map(r => r.id);
                        const toCreate = allFiltersValues.filter(val => String(val.product_value_id).startsWith('new_'));
                        const incomingExistingIds = allFiltersValues
                            .filter(val => !String(val.product_value_id).startsWith('new_'))
                            .map(val => Number(val.product_value_id));
                        const toDelete = existingIds.filter(id => !incomingExistingIds.includes(id));

                        for (const createItem of toCreate) {
                            await FilterProductValue.findOrCreate({
                                where: {
                                    filter_value_id: createItem.id,
                                    product_id: id
                                }
                            })
                        }
                        for (const deleteId of toDelete) {
                            await FilterProductValue.destroy({where: {id: deleteId}});
                        }

                        await axios.put(`http://localhost:9200/products/_doc/${id}`, {
                            product_id: +id,
                            name: `${name} ${series}`.toLowerCase(),
                            name_ru: `${name_ru} ${series_ru}`.toLowerCase(),
                            tags: tags.toLowerCase().split(","),
                            tags_ru: tags_ru.toLowerCase().split(","),
                            codes: options.flatMap(opt => opt.code.split(',').filter(Boolean).map(c => c.split('-')[1].toLowerCase())),
                            filters: allFiltersValues.map(v => v.name).join(' ').toLowerCase(),
                            filters_ru: allFiltersValues.map(v => v.name_ru).join(' ').toLowerCase(),
                            original: categories.some(item => item.id === 60),
                            active: active,
                            stock: stock
                        }, {
                            auth: {
                                username: 'elasticuser',
                                password: process.env.ELASTIC_PASS,
                            }
                        }).catch(() => {
                        });

                        const updateData = {
                            active,
                            weekdiscount,
                            hit,
                            brandId: brand.id,
                            name,
                            company,
                            name_ru,
                            tags_ru,
                            tags,
                            series,
                            series_ru,
                            disc,
                            status,
                            disc_ru,
                            countryId
                        };

                        if (!active && status === 'hidden') {
                            updateData.link = await Transliterations(`${name}-${series}`);
                        }
                        await Device.update(updateData, {where: {id}}).then(() => {
                            UpdateStock([id])
                            return res.json(id);
                        })

                    } else {
                        return next(apiError.badRequest("Товар не знайдено"));
                    }
                })

        } catch (e) {
            console.log(e)
            TelegramMsg("TECH", `update product ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

}

module.exports = new CreateProduct();
