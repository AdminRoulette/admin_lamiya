const {Op, literal} = require("sequelize");
const {
    Device,
    Brand,
    ParfumePart,
    BodyCarePart,
    Category,
    DeviceOptions,
    DeviceImage,
    FilterNote,
    Parfume_Note,
    Product_Category,
    StockHistory,
    Supply, User, FilterProductNote, FilterValues, Filters, Country,
} = require('../../models/models');
const apiError = require('../../error/apierror');
const S3 = require('aws-sdk/clients/s3')
const TelegramMsg = require("../../functions/TelegramMsg");
const axios = require("axios");
const accessKeyId = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY


class DeviceController {

    async getOptionForEditOrder(req, res, next) {
        let {id} = req.params;
        try {
            let option = {};
            await DeviceOptions.findOne({
                order: [[DeviceImage, "index", "ASC"]],
                where: {id}, include: [{model: DeviceImage}, {
                    model: Device
                }]
            }).then((DeviceOption) => {
                let deviceElem = DeviceOption.device;

                option = {
                    id: undefined,
                    image: DeviceOption.deviceimages[0]?.image,
                    option_id: DeviceOption.id,
                    product_name: `${deviceElem.name} ${DeviceOption.optionName}`,
                    series: deviceElem.series,
                    price: DeviceOption.price,
                    saleprice: DeviceOption.saleprice,
                    count: 1,
                    deviceId: DeviceOption.device.id
                }
            });
            return res.json(option)
        } catch (e) {
            TelegramMsg("TECH", `getOptionForEditOrder ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getProductList(req, res, next) {
        const {name} = req.query;
        try {
            let devices = await Device.findAll({
                where: {
                    [Op.or]: [!isNaN(+name) ? {id: +name} : null, {name: {[Op.iLike]: `%${name}%`}}, {series: {[Op.iLike]: `%${name}%`}}]
                },
                attributes: ["name", 'id'],
                order: [['name', 'ASC']],
                include: [
                    {
                        model: DeviceOptions,
                        attributes: ["optionName", 'id'],
                        include: [{model: DeviceImage, attributes: ["image"]}]
                    }]
            });
            return res.json(devices)
        } catch (e) {
            TelegramMsg("TECH", `getAllDevicesForEditOrder ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getLongProductInfo(req, res, next) {
        try {
            const {id} = req.params;
            await Device.findOne({
                where: {id}, include: [{model: BodyCarePart}, {model: Country}]
            }).then(async (deviceElement) => {

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
                        name: val.name
                    });
                }

                return res.json({
                    filters: [...groupedMap.values()],
                    bodycarepart: deviceElement.bodycarepart ? deviceElement.bodycarepart : undefined,
                    disc: deviceElement.disc,
                    country: deviceElement.country.name
                })
            });

        } catch (e) {
            TelegramMsg("TECH", `getLongProductInfo ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getAdminProducts(req, res, next) {
        try {
            let devArr = [];
            const {value} = req.query;
            const status = req.query.status || "";
            let ids = [];
            const orderMap = new Map();
            let order = [['active', 'DESC'], [Product_Category, 'category', "id", "ASC"], [Brand, 'name', 'ASC'], ['name', 'ASC'], [DeviceOptions, 'index', 'ASC'], [Product_Category, 'category', "level", "ASC"], [Product_Category, "id", "ASC"], [DeviceOptions, DeviceImage, 'index', 'ASC']];

            if (value) {
                const words = value.trim().split(/\s+/);
                const queries = [
                    {
                        "match": {
                            "name": {
                                "query": value,
                                "operator": "or",
                                "boost": 30
                            }
                        }
                    },
                    {
                        "match": {
                            "name": {
                                "query": value,
                                "operator": "or",
                                "prefix_length": 2,
                                "fuzziness": "AUTO",
                                "boost": 25
                            }
                        }
                    },
                    {
                        "term": {
                            "codes": {
                                "value": value,
                                "boost": 100.0
                            }
                        }
                    },
                    {
                        "match_phrase": {
                            "tags.exact": {
                                "query": value,
                                "boost": 20.0
                            }
                        }
                    },
                    {
                        "match_phrase": {
                            "tags": {
                                "query": value,
                                "slop": 2,
                                "boost": 15.0
                            }
                        }
                    },
                    {
                        "match": {
                            "tags": {
                                "query": value,
                                "fuzziness": "AUTO",
                                "operator": "and",
                                "boost": 10.0
                            }
                        }
                    },
                    {
                        "match": {
                            "tags": {
                                "query": value,
                                "fuzziness": "AUTO",
                                "operator": "or",
                                "boost": 5.0
                            }
                        }
                    },


                    {
                        "match_phrase": {
                            "filters.exact": {
                                "query": value,
                                "boost": 4.0
                            }
                        }
                    },
                    {
                        "match_phrase": {
                            "filters": {
                                "query": value,
                                "slop": 2,
                                "boost": 3.0
                            }
                        }
                    },
                    {
                        "match": {
                            "filters": {
                                "query": value,
                                "fuzziness": "AUTO",
                                "operator": "and",
                                "boost": 2.0
                            }
                        }
                    },
                    {
                        "match": {
                            "filters": {
                                "query": value,
                                "fuzziness": "AUTO",
                                "operator": "or",
                                "boost": 1.0
                            }
                        }
                    },
                ]
                if (!isNaN(value) && !isNaN(parseFloat(value))) {
                    queries.push({
                        "term": {
                            "product_id": {
                                "value": value,
                                "boost": 120.0
                            }
                        }
                    })
                }

                if (words.length > 1) {
                    queries.push({
                        "match_phrase": {
                            "name.exact": {
                                "query": value,
                                "slop": 2,
                                "boost": 50
                            }
                        }
                    });
                    queries.push({
                        "match_phrase": {
                            "name": {
                                "query": value,
                                "slop": 2,
                                "boost": 45
                            }
                        }
                    });
                }
                const searchRes = await axios.post('http://localhost:9200/products/_search', {
                        size: 100,
                        "query":
                            {
                                "dis_max": {
                                    "queries": queries,
                                    "tie_breaker": 0.3
                                }
                            }
                    },
                    {
                        auth: {
                            username: 'elastic',
                            password: process.env.ELASTIC_PASS,
                        }
                    });

                const elasticResults = searchRes.data.hits.hits;
                ids = elasticResults.map(item => item._id)
                elasticResults.forEach((hit, index) => {
                    orderMap.set(+hit._source.product_id, {
                        position: index,
                        score: hit._score
                    });
                });
            }

            let where = ids.length > 0 ? {id: {[Op.in]: ids}} : {};

            if (value && ids.length === 0) return next(apiError.badRequest("Товари не знайдено"));

            if (status) {
                if (status === 'on-tab') {
                    where = {...where, '$product_categories.categoryId$': 89, active: true};
                } else if (status === 'fluid') {
                    where = {...where, '$product_categories.categoryId$': 95, active: false};
                    order = [['name', 'ASC'], [DeviceOptions, 'index', 'ASC'], [Product_Category, 'category', "level", "ASC"], [Product_Category, "id", "ASC"], [DeviceOptions, DeviceImage, 'index', 'ASC']]
                } else if (status === 'ready') {
                    where = {
                        ...where,
                        status: 'ready'
                    };
                } else if (status === 'moderation') {
                    where = {...where, status: 'moderation'};
                } else if (status === 'hidden') {
                    where = {...where, active: false};
                }
            }

            await Device.findAll({
                where,
                order: status === 'ready' || status === 'moderation'
                    ? [['active', 'DESC'], ['name', 'ASC'], [DeviceOptions, 'index', 'ASC'], [Product_Category, 'category', "level", "ASC"], [Product_Category, "id", "ASC"], [DeviceOptions, DeviceImage, 'index', 'ASC']]
                    : order,
                include: [{model: Brand}, {
                    model: Product_Category,
                    include: [{model: Category, as: 'category'}]
                }, {
                    model: ParfumePart
                }, {model: BodyCarePart},
                    {model: DeviceOptions, include: [{model: DeviceImage}]}]
            }).then(async (deviceArray) => {
                for (const deviceElement of deviceArray) {
                    if (deviceElement) {
                        let options = [];
                        let options_on_tab = [];
                        for (const OptionElems of deviceElement.deviceoptions) {
                            const option_obj = {
                                count: OptionElems.count,
                                id: OptionElems.id,
                                price: OptionElems.price,
                                saleprice: OptionElems.saleprice,
                                optionName: OptionElems.optionName,
                                active_code:OptionElems.active_code,
                                stock: OptionElems.count > 0 ||
                                    OptionElems.sell_type === 'preorder' || OptionElems.sell_type === 'storage',
                            }
                            OptionElems.sell_type === "on_tab" || OptionElems.sell_type === "sell_bottle" ? options_on_tab.push(option_obj) : options.push(option_obj);
                        }
                        if (status === 'ready' && !(deviceElement.deviceoptions.length > 0 &&
                            deviceElement.deviceoptions.every(option => option.deviceimages.length > 0))) continue;

                        if (status === 'moderation' && (deviceElement.deviceoptions.length > 0 &&
                            deviceElement.deviceoptions.every(option => option.deviceimages.length > 0))) continue;

                        devArr.push({
                            part_count: deviceElement.parfumepart?.partcount,
                            refund_count: deviceElement.parfumepart?.refund_count,
                            brand: deviceElement.brand?.name,
                            category: deviceElement.product_categories[0]?.category.name,
                            options: options,
                            status: deviceElement.status,
                            options_on_tab: options_on_tab,
                            image: deviceElement?.deviceoptions[0]?.deviceimages[0]?.image,
                            disc: deviceElement.disc,
                            id: deviceElement.id,
                            name: deviceElement.name,
                            series: deviceElement.series,
                            on_tab_price: deviceElement.parfumepart?.on_tab_price,
                            color: deviceElement.status === 'active' ? "#000000" : deviceElement.status === 'moderation'
                                ? "#8306be" : deviceElement.status === 'ready' ? '#00a86b' : deviceElement.status === 'discontinued' ? "#808080" : "#fd4242"
                        })
                    }
                }
                if (devArr.length === 0) return next(apiError.badRequest("Товари не знайдено"));
                if (ids.length > 0) {
                    const sortedProducts = devArr.sort((a, b) => {
                        const positionA = orderMap.get(a.id).position;
                        const positionB = orderMap.get(b.id).position;
                        return positionA - positionB;
                    });
                    return res.json(sortedProducts)
                } else {
                    return res.json(devArr)
                }

            });
        } catch (e) {
            TelegramMsg("TECH", `getAdminProducts ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async SearchSimilar(req, res, next) {
        try {
            const {value} = req.query;

            if (!value) return next(apiError.badRequest("Пусте поле пошуку"));

            const words = value.trim().split(/\s+/);
            const queries = [
                {
                    "match": {
                        "name": {
                            "query": value,
                            "operator": "or",
                            "boost": 30
                        }
                    }
                },
                {
                    "match": {
                        "name": {
                            "query": value,
                            "operator": "or",
                            "prefix_length": 2,
                            "fuzziness": "AUTO",
                            "boost": 25
                        }
                    }
                },
                {
                    "term": {
                        "codes": {
                            "value": value,
                            "boost": 100.0
                        }
                    }
                },
                {
                    "match_phrase": {
                        "tags.exact": {
                            "query": value,
                            "boost": 20.0
                        }
                    }
                },
                {
                    "match_phrase": {
                        "tags": {
                            "query": value,
                            "slop": 2,
                            "boost": 15.0
                        }
                    }
                },
                {
                    "match": {
                        "tags": {
                            "query": value,
                            "fuzziness": "AUTO",
                            "operator": "and",
                            "boost": 10.0
                        }
                    }
                },
                {
                    "match": {
                        "tags": {
                            "query": value,
                            "fuzziness": "AUTO",
                            "operator": "or",
                            "boost": 5.0
                        }
                    }
                },


                {
                    "match_phrase": {
                        "filters.exact": {
                            "query": value,
                            "boost": 4.0
                        }
                    }
                },
                {
                    "match_phrase": {
                        "filters": {
                            "query": value,
                            "slop": 2,
                            "boost": 3.0
                        }
                    }
                },
                {
                    "match": {
                        "filters": {
                            "query": value,
                            "fuzziness": "AUTO",
                            "operator": "and",
                            "boost": 2.0
                        }
                    }
                },
                {
                    "match": {
                        "filters": {
                            "query": value,
                            "fuzziness": "AUTO",
                            "operator": "or",
                            "boost": 1.0
                        }
                    }
                },
            ]
            if (!isNaN(value) && !isNaN(parseFloat(value))) {
                queries.push({
                    "term": {
                        "product_id": {
                            "value": value,
                            "boost": 120.0
                        }
                    }
                })
            }

            if (words.length > 1) {
                queries.push({
                    "match_phrase": {
                        "name.exact": {
                            "query": value,
                            "slop": 2,
                            "boost": 50
                        }
                    }
                });
                queries.push({
                    "match_phrase": {
                        "name": {
                            "query": value,
                            "slop": 2,
                            "boost": 45
                        }
                    }
                });
            }
            const searchRes = await axios.post('http://localhost:9200/products/_search', {
                    size: 10,
                    "query":
                        {
                            "dis_max": {
                                "queries": queries,
                                "tie_breaker": 0.3
                            }
                        }
                },
                {
                    auth: {
                        username: 'elastic',
                        password: process.env.ELASTIC_PASS,
                    }
                });

            const elasticResults = searchRes.data.hits.hits;
            const ids = elasticResults.map(item => item._id)

            const orderExpr = `CASE ${ids.map((id, index) => `WHEN id = ${id} THEN ${index}`).join(' ')} END`;
            let where = ids.length > 0 ? {id: {[Op.in]: ids}} : {};

            if (value && ids.length === 0) return next(apiError.badRequest("Товари не знайдено"));

            const deviceArray = await Device.findAll({
                where,
                order: [[literal(orderExpr), 'ASC']],
                include: [{
                    model: DeviceOptions,
                    limit:1,
                    include: [{model: DeviceImage, limit:1}]
                    }]
            })
            return res.json(deviceArray)
        } catch (e) {
            TelegramMsg("TECH", `getAdminProducts ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getStockHistory(req, res, next) {
        try {
            const {ids, user_id,offset} = req.query;
            let where = {};
            if(ids){
                where = {option_id: {[Op.in]: ids.split(",")}}
            }
            if(user_id){
                where = {...where, user_id};
            }

            const stock = await StockHistory.findAll({
                order: [['id', 'DESC']],
                where,
                limit:100,
                offset: offset * 100,
                include: [{model: User},
                    {
                        model: DeviceOptions,
                        attributes: ['optionName'],
                        include: [
                            {model: Device, attributes: ['name']}
                        ]
                    }
                ]
            })

            return res.json(stock)
        } catch (e) {
            TelegramMsg("TECH", `getStockHistory ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

}

module.exports = new DeviceController();
