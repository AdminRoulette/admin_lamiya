const apiError = require("../error/apierror");
const {Op, literal} = require("sequelize");
const Marketplace = require("../functions/Marketplace/Marketplace");
const {
    DeviceOptions,
    Device,
    Product_Category,
    Brand,
    FilterValues,
    Filters,
    OrderDevice,
    nova_poshta_cities, nova_poshta_streets, Orders, DeviceImage, ChecksOrder, PaymentOrder, DeliveryOrder, FopsList,
    nova_poshta_warehouses, SupplyProducts, PriceTags, StockHistory, WishList, BasketDevice, Country, Rating,
    BodyCarePart, ParfumePart, FilterProductValue, RatingImage, SimilarDevices
} = require("../models/models");
const UpdateParfumeStorage = require("../functions/ParfumeStorages/UpdateParfumeStorage");
const ExcelJS = require("exceljs");
const axios = require("axios");
const TelegramMsg = require("../functions/TelegramMsg");
const crypto = require("crypto");
const S3 = require("aws-sdk/clients/s3");
const MonoPartPayments = require("../functions/PartPayments/MonoPartPayments");
const {create} = require("xmlbuilder2");
const iconv = require('iconv-lite');
const fs = require('fs');
const Transliterations = require("../functions/SearchComponents/Transliterations");
const GenerateRandomCode = require("../functions/Product/GenerateRandomCode");
const UploadImages = require("../functions/Product/UploadImagesToAWS");
const sharp = require("sharp");

class RozetkaController {
    async Marketplace(req, res, next) {
        try {
            return res.json(await Marketplace());
        } catch (error) {
            console.error('Full error:', error.message);
            next(apiError.badRequest(`error: ${error.message}`));
        }
    }

    async CreateElastic(req, res, next) {
        try {

            const result = await axios.get('http://localhost:9200', {
                auth: {
                    username: 'elastic', password: process.env.ELASTIC_PASS,
                }, headers: {
                    'Content-Type': 'application/json'
                }
            });

            // await axios.delete('http://localhost:9200/products', {
            //     auth: {
            //         username: 'elastic',
            //         password: process.env.ELASTIC_PASS,
            //     }, headers: {
            //         'Content-Type': 'application/json'
            //     }
            // })

            // const result = await axios.put('http://localhost:9200/products', {
            //     "settings": {
            //         "analysis": {
            //             "analyzer": {}
            //         }, "number_of_shards": 1, "number_of_replicas": 1
            //     }, "mappings": {
            //         "properties": {
            //             "original": {
            //                 "type": "boolean"
            //             }, "active": {
            //                 "type": "boolean"
            //             }, "stock": {
            //                 "type": "boolean"
            //             }, "product_id": {
            //                 "type": "integer"
            //             }, "name": {
            //                 "type": "text", "analyzer": "ukrainian", "fields": {
            //                     "exact": {
            //                         "type": "text", "analyzer": "simple"
            //                     }, "keyword": {
            //                         "type": "keyword"
            //                     }
            //                 }
            //             }, "name_ru": {
            //                 "type": "text", "analyzer": "russian", "fields": {
            //                     "keyword": {
            //                         "type": "keyword"
            //                     }
            //                 }
            //             }, "tags": {
            //                 "type": "text", "analyzer": "ukrainian", "fields": {
            //                     "exact": {
            //                         "type": "keyword"
            //                     }
            //                 }
            //             }, "tags_ru": {
            //                 "type": "text", "analyzer": "russian", "fields": {
            //                     "exact": {
            //                         "type": "keyword"
            //                     }
            //                 }
            //             }, "codes": {
            //                 "type": "keyword"
            //             }, "filters": {
            //                 "type": "text", "analyzer": "ukrainian", "fields": {
            //                     "exact": {
            //                         "type": "keyword"
            //                     }
            //                 }
            //             },
            //         }
            //     }
            // }, {
            //     auth: {
            //         username: 'elastic', password: process.env.ELASTIC_PASS,
            //     }, headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });

            // await axios.delete('http://localhost:9200/options', {}, {
            //     auth: {
            //         username: 'elastic',
            //         password: process.env.ELASTIC_PASS,
            //     },
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // })

            // const result2 = await axios.put('http://localhost:9200/options', {
            //     "settings": {
            //         "analysis": {
            //             "analyzer": {}
            //         },
            //         "number_of_shards": 1,
            //         "number_of_replicas": 1
            //     },
            //     "mappings": {
            //         "properties": {
            //             "option_id": {
            //                 "type": "integer"
            //             },
            //             "product_id": {
            //                 "type": "integer"
            //             },
            //             "product_name": {
            //                 "type": "text",
            //                 "analyzer": "ukrainian",
            //                 "fields": {
            //                     "exact": {
            //                         "type": "text",
            //                         "analyzer": "simple"
            //                     },
            //                     "keyword": {
            //                         "type": "keyword"
            //                     }
            //                 }
            //             },
            //             "product_name_ru": {
            //                 "type": "text",
            //                 "analyzer": "russian",
            //                 "fields": {
            //                     "keyword": {
            //                         "type": "keyword"
            //                     }
            //                 }
            //             },
            //             "product_tags": {
            //                 "type": "text",
            //                 "analyzer": "ukrainian",
            //                 "fields": {
            //                     "exact": {
            //                         "type": "keyword"
            //                     }
            //                 }
            //             },
            //             "product_tags_ru": {
            //                 "type": "text",
            //                 "analyzer": "russian",
            //                 "fields": {
            //                     "exact": {
            //                         "type": "keyword"
            //                     }
            //                 }
            //             },
            //             "codes": {
            //                 "type": "keyword"
            //             }
            //         }
            //     }
            // }, {
            //     auth: {
            //         username: 'elastic',
            //         password: process.env.ELASTIC_PASS,
            //     },
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });

            return res.json("done");

        } catch (error) {
            console.error('Full error:', error?.response?.data?.error);
            next(apiError.badRequest(`error: ${error.message}`));
        }
    }

    async StorageExcel(req, res, next) {
        try {
            const data = await UpdateParfumeStorage();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Замовлення');
            worksheet.columns = [{key: 'list', width: 10}, {key: 'code', width: 10}, {key: 'name', width: 140}];

            for (const item of data.new) {
                if (item.list !== 's2') {
                    worksheet.addRow({
                        list: item.list, code: item.code.split("-")[1], name: item.full_name
                    });
                }
            }

            const buffer = await workbook.xlsx.writeBuffer();
            res.setHeader('Content-Disposition', 'attachment; filename="generated.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            return res.send(buffer);
        } catch (err) {
            next(apiError.badRequest(`error: ${err.message}`));
        }
    }

    async UpdateElastic(req, res, next) {
        try {
            const products = await Device.findAll({
                include: [{model: Brand, attributes: ["id", 'name', 'name_ru']}, {
                    model: DeviceOptions, attributes: ["code", "id", "optionName", "optionName_ru"]
                }, {
                    model: FilterValues, through: {attributes: []}, attributes: ["name", "name_ru", 'id'], include: [{
                        model: Filters, attributes: ["code", 'id', 'name', 'name_ru']
                    }]
                },
                    {
                        model: Product_Category, attributes: ["id", 'categoryId']
                    }]
            })
            for (const item of products) {
                await axios.put(`http://localhost:9200/products/_doc/${item.id}`, {
                    product_id: +item.id,
                    name: `${item.name} ${item.series}`.toLowerCase(),
                    name_ru: `${item.name_ru} ${item.series_ru}`.toLowerCase(),
                    tags: item.tags.toLowerCase().split(","),
                    tags_ru: item.tags_ru.toLowerCase().split(","),
                    codes: item.deviceoptions.flatMap(opt => opt.code.split(',').filter(Boolean).map(c => c.split('-')[1].toLowerCase())),
                    filters: item.filter_values.map(v => v.name).join(' ').toLowerCase(),
                    filters_ru: item.filter_values.map(v => v.name_ru).join(' ').toLowerCase(),
                    original: item.product_categories.some(item => item.categoryId === 60),
                    active: item.active,
                    stock: item.stock
                }, {
                    auth: {
                        username: 'elastic', password: process.env.ELASTIC_PASS,
                    }, headers: {
                        'Content-Type': 'application/json'
                    }
                });

                for (const option of item.deviceoptions) {
                    await axios.put(`http://localhost:9200/options/_doc/${option.id}`, {
                        option_id: +option.id,
                        product_id: item.id,
                        product_name: `${item.brand.name} ${item.name} ${item.series} ${option.optionName}`.toLowerCase(),
                        product_name_ru: `${item.brand.name_ru} ${item.name_ru} ${item.series_ru} ${option.optionName_ru}`.toLowerCase(),
                        product_tags: item.tags.toLowerCase().split(","),
                        product_tags_ru: item.tags_ru.toLowerCase().split(","),
                        codes: option.code.split(',').filter(Boolean)
                    }, {
                        auth: {
                            username: 'elastic',
                            password: process.env.ELASTIC_PASS,
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            }


            return res.json(products);
        } catch (err) {
            next(apiError.badRequest(`error: ${err.message}`));
        }
    }

    async UpdateProductScore(req, res, next) {
        try {
            const weights = {
                rating: 5,        // Вага рейтингу  0-5
                sales: 1,         // Вага продажів
                reviews: 5,       // Вага відгуків
                saleprice: 1,         // Вага знижки %
            };

            const devices = await Device.findAll({
                where: {active: true},
                attributes: ['id', 'rating', 'ratingCount', 'active', 'score', 'hit'],
                include: [{
                    model: DeviceOptions,
                    where: {saleprice: {[Op.gt]: 0}},
                    limit: 1,
                    attributes: ['count', 'price', 'saleprice'],
                }]
            });

            for (const device of devices) {
                const salesScore = await OrderDevice.count({
                    where: {
                        createdAt: {[Op.gte]: literal('CURRENT_TIMESTAMP - INTERVAL \'60 days\'')}
                    },
                    include: [{
                        model: DeviceOptions, required: true, include: [{
                            model: Device, required: true, where: {id: device.id}
                        }]
                    }]
                });

                const ratingScore = device.rating > 3 ? device.rating : 0;
                const reviewsScore = device.ratingCount;
                const priceScore = device.deviceoptions.length > 0 ? Math.round((1 - (device.deviceoptions[0].saleprice / device.deviceoptions[0].price)) * 100) : 0;

                const finalScore = Math.round((ratingScore * weights.rating) + (salesScore * weights.sales) + (reviewsScore * weights.reviews) + (priceScore * weights.saleprice));
                if (device.score !== finalScore || device.hit !== salesScore > 7) {
                    await Device.update({score: finalScore, hit: salesScore > 7}, {where: {id: device.id}});
                }
            }
            return res.json("done2");

        } catch (err) {
            console.log(err)
            next(apiError.badRequest(`error: ${err.message}`));
        }
    }

    async DeleteProduct(req, res, next) {
        try {
            const {id} = req.query
            const device = await Device.findOne({
                where: {id},
                include: [{
                    model: DeviceOptions,
                    include: [{model: DeviceImage}]
                },
                    {
                        model: Rating,
                        include: [{model: RatingImage}]
                    }
                ]
            })

            for (const option of device.deviceoptions) {
                for (const image of option.deviceimages) {
                    await DeviceImage.destroy({where: {id: image.id}}).then(() => {
                        let s3Link = image.image.split("https://lamiya.s3.amazonaws.com/")[1];
                        const s3 = new S3({
                            region: 'eu-central-1',
                            accessKeyId: process.env.S3_ACCESS_KEY,
                            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
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


                await SupplyProducts.destroy({where: {option_id: id}})
                await PriceTags.destroy({where: {option_id: id}})
                await StockHistory.destroy({where: {option_id: id}})
                await OrderDevice.destroy({where: {option_id: id}})
                await WishList.destroy({where: {deviceoptionId: id}})
                await DeviceOptions.destroy({where: {id}})
                await BasketDevice.destroy({where: {deviceoptionId: id}})
            }
            for (const rating of device.ratings) {
                for (const item of rating.ratingimages) {
                    let s3Link = item.img.split("https://lamiya.s3.amazonaws.com/")[1];
                    const s3 = new S3({
                        region: 'eu-central-1',
                        accessKeyId: process.env.S3_ACCESS_KEY,
                        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
                    })
                    s3.deleteObject({
                        Bucket: "lamiya", Key: `${s3Link}`
                    }, function (err, data) {
                    })
                }
            }

            await FilterProductValue.destroy({where: {product_id: id}})
            await Product_Category.destroy({where: {productId: id}})
            await Rating.destroy({where: {deviceId: id}})
            await DeviceOptions.destroy({where: {deviceId: id}})
            await BodyCarePart.destroy({where: {deviceId: id}})
            await ParfumePart.destroy({where: {deviceId: id}})
            await Device.destroy({where: {id}})


            return res.json("deleted");
        } catch (error) {
            console.error('Full error:', error.message);
            next(apiError.badRequest(`error: ${error.message}`));
        }
    }

    async DeleteOption(req, res, next) {
        try {
            const {id} = req.query

            const option = await DeviceOptions.findOne({
                where: {id}, include: [{model: DeviceImage}]
            })

            if (!option) {
                return (apiError.badRequest("Опцію не знайдено"));
            }

            for (const image of option.deviceimages) {
                await DeviceImage.destroy({where: {id: image.id}}).then(() => {
                    let s3Link = image.image.split("https://lamiya.s3.amazonaws.com/")[1];
                    const s3 = new S3({
                        region: 'eu-central-1',
                        accessKeyId: process.env.S3_ACCESS_KEY,
                        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
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

            await DeviceOptions.destroy({where: {id}})
            await SupplyProducts.destroy({where: {option_id: id}})
            await PriceTags.destroy({where: {option_id: id}})
            await StockHistory.destroy({where: {option_id: id}})
            await OrderDevice.destroy({where: {option_id: id}})
            await WishList.destroy({where: {deviceoptionId: id}})
            await BasketDevice.destroy({where: {deviceoptionId: id}})


            return res.json("deleted");
        } catch (error) {
            console.error('Full error:', error.message);
            next(apiError.badRequest(`error: ${error.message}`));
        }
    }

    async UploadXML(req, res, next) {
        try {
            //завантаження в роутері через мультер
            return res.json("UploadXML");
        } catch (error) {
            console.error('Full error:', error.message);
            next(apiError.badRequest(`error: ${error.message}`));
        }
    }

    async Test1(req, res, next) {
        try {

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            const filePath = './storage-files/lucom.xml';
            const buffer = fs.readFileSync(filePath);

            const xml = iconv.decode(Buffer.from(buffer), 'utf-8');

            const doc = create(xml);
            const obj = doc.end({format: 'object'});

            const shop = obj.yml_catalog.shop
            let categories = {}

            for (const category of shop.categories.category) {
                categories[category['@id']] = category['#'];
            }

            const offers = shop.offers.offer

            const array = [];
            for (let i = 315; i < offers.length; i++) {
                const offer = offers[i]
                let fix_offer = offer['#'] ? offer['#'] : Object.entries(offer).map(([key, value]) => ({[key]: value}))
                let finalOffer = {};
                finalOffer['code'] = offer['@'] ? offer['@'].id : offer['@id']
                for (const item of fix_offer) {
                    const [key, value] = Object.entries(item)[0];
                    if (finalOffer[key]) {
                        if (Array.isArray(finalOffer[key])) {
                            if (Array.isArray(value)) {
                                finalOffer[key].push(...value);
                            } else {
                                finalOffer[key].push(value);
                            }
                        } else {
                            finalOffer[key] = Array.isArray(value) ? [finalOffer[key], ...value] : [finalOffer[key], value];
                        }
                    } else {
                        finalOffer[key] = value;
                    }
                }
                array.push(finalOffer);
            }


            for (const item of array) {
                let final_obj = {}
                if (item.vendor) {
                    const brand = await Brand.findOne({where: {name: item.vendor}})
                    if (brand) {
                        final_obj.brandId = brand.id
                    } else {
                        const brand = await Brand.create(
                            {name: item.vendor, name_ru: item.vendor, code: await Transliterations(item.vendor)}
                        )
                        final_obj.brandId = brand.id
                    }

                }
                if (item.description_ua) {
                    final_obj.disc = `<p>${item.description_ua.replaceAll("»","ы")}</p>`;
                }
                if (item.description) {
                    final_obj.disc_ru = `<p>${item.description.replaceAll("»","ы")}</p>`;
                }
                if (item.keywords) {
                    final_obj.tags_ru = item.keywords.replaceAll("»","ы");
                }
                if (item.keywords_ua) {
                    final_obj.tags = item.keywords_ua.replaceAll("»","ы");
                }
                if (item.name) {
                    final_obj.name_ru = item.name.replaceAll("»","ы");
                }
                if (item.name_ua) {
                    final_obj.name = `${item.name_ua.replaceAll("»","ы")}  (категорія: ${categories[item.categoryId]})`;
                }
                if (await Device.findOne({where: {link: await Transliterations(final_obj.name)}})) continue;

                console.log({
                    ...final_obj,
                    active: false,
                    status: "hidden",
                    link: await Transliterations(final_obj.name)
                })
                const device = await Device.create({
                    ...final_obj,
                    active: false,
                    status: "hidden",
                    link: await Transliterations(final_obj.name)
                })

                if (item.param) {
                    for (const param of item.param) {
                        if (!param['#']) continue;
                        if (!param['@name']) continue;
                        const paramName = param['@name'].replaceAll("»","ы")
                        if (paramName === 'Код товару') continue;
                        if (paramName === 'Виробник') continue;

                        const paramCodes= param['#'].replaceAll("»","ы").split(',')
                        for(const paramCode of paramCodes) {
                            const value = await FilterValues.findOne({where: {name: paramCode}})
                            if (value) {
                                console.log({product_id: device.id, filter_value_id: value.id})
                                await FilterProductValue.findOrCreate({
                                    where: {
                                        product_id: device.id,
                                        filter_value_id: value.id
                                    },
                                    defaults: {
                                        product_id: device.id,
                                        filter_value_id: value.id
                                    }
                                });
                            } else {
                                const filter = await Filters.findOne({where: {name: paramName}})
                                if (filter) {
                                    const value = await FilterValues.create({
                                        name: paramCode,
                                        code: await Transliterations(paramCode),
                                        filter_id: filter.id
                                    })
                                    await FilterProductValue.findOrCreate({
                                        where: {
                                            product_id: device.id,
                                            filter_value_id: value.id
                                        },
                                        defaults: {
                                            product_id: device.id,
                                            filter_value_id: value.id
                                        }
                                    });
                                } else {
                                    const filter = await Filters.create({
                                        name: paramName,
                                        code: await Transliterations(paramName)
                                    })
                                    const value = await FilterValues.create({
                                        name: paramCode,
                                        code: await Transliterations(paramCode),
                                        filter_id: filter.id
                                    })
                                    await FilterProductValue.findOrCreate({
                                        where: {
                                            product_id: device.id,
                                            filter_value_id: value.id
                                        },
                                        defaults: {
                                            product_id: device.id,
                                            filter_value_id: value.id
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
                const option = await DeviceOptions.create({
                    deviceId: device.id,
                    price: item.price,
                    code: `luc-${item.code}`
                })
                if (item.picture) {
                    const accessKeyId = process.env.S3_ACCESS_KEY
                    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
                    const s3 = new S3({
                        region: 'eu-central-1', accessKeyId, secretAccessKey
                    })
                    const fixedBasket = process.env.NODE_ENV === "production" ? `lamiya/images/${device.id}` : `lamiya/test/${device.id}`
                    if (Array.isArray(item.picture)) {
                        for (let i = 0; i < item.picture.length; i++) {
                            try {
                                const fileName = `${option.id}-hq-` + await GenerateRandomCode(4) + ".webp"
                                const response = await axios.get(item.picture[i], {responseType: 'arraybuffer'});
                                await sleep(500);
                                const webpResize = await sharp(response.data)
                                    .resize({
                                        width: 600,
                                        height: 600,
                                        fit: 'contain',
                                        background: '#ffffff'
                                    })
                                    .flatten({background: '#ffffff'})
                                    .toFormat('webp')
                                    .toBuffer();
                                const uploadParamsWebpResize = {
                                    Bucket: fixedBasket,
                                    Body: webpResize,
                                    Key: fileName.replace("-hq-", "-lq-"),
                                    ACL: 'public-read',
                                    ContentType: 'image/webp',
                                    CacheControl: 'max-age=31536000'
                                };
                                s3.upload(uploadParamsWebpResize).promise();
                                const webp = await sharp(response.data)
                                    .flatten({background: '#ffffff'})
                                    .toFormat('webp')
                                    .toBuffer();
                                const uploadParamsWebp = {
                                    Bucket: fixedBasket,
                                    Body: webp,
                                    Key: fileName,
                                    ACL: 'public-read',
                                    ContentType: 'image/webp',
                                    CacheControl: 'max-age=31536000'
                                };
                                s3.upload(uploadParamsWebp).promise();


                                const jpg = await sharp(response.data)
                                    .flatten({background: '#ffffff'})
                                    .jpeg()
                                    .toBuffer();
                                const uploadParamsJpg = {
                                    Bucket: fixedBasket,
                                    Body: jpg,
                                    Key: fileName.replace(".webp", ".jpg"),
                                    ACL: 'public-read',
                                    ContentType: 'image/jpeg',
                                    CacheControl: 'max-age=31536000'
                                };
                                s3.upload(uploadParamsJpg).promise();
                                await DeviceImage.create({
                                    image: `https://lamiya.s3.amazonaws.com/images/${device.id}/${fileName}`,
                                    option_id: option.id,
                                    index: i
                                })
                            } catch (err) {
                                continue;
                            }
                        }

                    } else {
                        try {
                            const fileName = `${option.id}-hq-` + await GenerateRandomCode(4) + ".webp"
                            const response = await axios.get(item.picture, {responseType: 'arraybuffer'});
                            await sleep(500);
                            const webpResize = await sharp(response.data)
                                .resize({
                                    width: 600,
                                    height: 600,
                                    fit: 'contain',
                                    background: '#ffffff'
                                })
                                .flatten({background: '#ffffff'})
                                .toFormat('webp')
                                .toBuffer();
                            const uploadParamsWebpResize = {
                                Bucket: fixedBasket,
                                Body: webpResize,
                                Key: fileName.replace("-hq-", "-lq-"),
                                ACL: 'public-read',
                                ContentType: 'image/webp',
                                CacheControl: 'max-age=31536000'
                            };
                            s3.upload(uploadParamsWebpResize).promise();
                            const webp = await sharp(response.data)
                                .flatten({background: '#ffffff'})
                                .toFormat('webp')
                                .toBuffer();
                            const uploadParamsWebp = {
                                Bucket: fixedBasket,
                                Body: webp,
                                Key: fileName,
                                ACL: 'public-read',
                                ContentType: 'image/webp',
                                CacheControl: 'max-age=31536000'
                            };
                            s3.upload(uploadParamsWebp).promise();


                            const jpg = await sharp(response.data)
                                .flatten({background: '#ffffff'})
                                .jpeg()
                                .toBuffer();
                            const uploadParamsJpg = {
                                Bucket: fixedBasket,
                                Body: jpg,
                                Key: fileName.replace(".webp", ".jpg"),
                                ACL: 'public-read',
                                ContentType: 'image/jpeg',
                                CacheControl: 'max-age=31536000'
                            };
                            s3.upload(uploadParamsJpg).promise();
                            await DeviceImage.create({
                                image: `https://lamiya.s3.amazonaws.com/images/${device.id}/${fileName}`,
                                option_id: option.id,
                                index: 0
                            })
                        } catch (err) {
                        }
                    }
                }
            }

            return res.json(array);
        } catch (error) {
            console.error('Full error:', error);
            next(apiError.badRequest(`error: ${error.message}`));
        }
    }

    async Test2(req, res, next) {
        try {

            return res.json("test1");
        } catch (error) {
            console.error('Full error:', error.message);
            next(apiError.badRequest(`error: ${error.message}`));
        }
    }

    async Test3(req, res, next) {
        try {

            return res.json("test1");
        } catch (error) {
            console.error('Full error:', error.message);
            next(apiError.badRequest(`error: ${error.message}`));
        }
    }

    async Test4(req, res, next) {
        try {

            return res.json("test1");
        } catch (error) {
            console.error('Full error:', error.message);
            next(apiError.badRequest(`error: ${error.message}`));
        }
    }

    async Test5(req, res, next) {
        try {

            return res.json("test1");
        } catch (error) {
            console.error('Full error:', error.message);
            next(apiError.badRequest(`error: ${error.message}`));
        }
    }
}

module.exports = new RozetkaController();
