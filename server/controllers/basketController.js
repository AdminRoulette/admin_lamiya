const {
    Basket,
    BasketDevice,
    Device,
    Type,
    Brand,
    Category,
    ParfumePart,
    DeviceOptions,
    DeviceImage,
    ProductBoxes,
    Parfume_Season,
    Season,
    Product_Category
} = require('../models/models');
const jwt = require('jsonwebtoken');
const {Op} = require("sequelize");
const apiError = require("../error/apierror");
const TelegramMsg = require("../functions/TelegramMsg");

class BasketController {
    async addDevice(req, res, next) {
        try {
            const {deviceoptionId, count} = req.body;
            const basketDev = await BasketDevice.findOne({
                where: {
                    userId: req.user.id, deviceoptionId: deviceoptionId
                }
            });
            if (!basketDev) {
                await BasketDevice.create({
                    userId: req.user.id, deviceoptionId: deviceoptionId, count: count,
                });
            } else {
                await BasketDevice.update({count: basketDev.count + 1}, {
                    where: {
                        id: basketDev.id
                    }
                })
            }
            return res.json("Товар додано до кошика");
        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }


    async changeCount(req, res, next) {

        let {optionId, count} = req.body;
        try {
            if (optionId && count > 0) {
                await DeviceOptions.findOne({
                    where: {id: optionId}
                }).then(async (Option) => {
                    if (Option.count >= count) {
                        await BasketDevice.update({count: count}, {
                            where: {
                                deviceoptionId: optionId, userId: req.user.id
                            }
                        })
                        return res.json({msg: "Кількість оновлено", error: ""});
                    } else {
                        return res.json({msg: "", error: Option.count});
                    }
                })
            } else {
                next(apiError.badRequest("Помилка кількості або id"));
            }
        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }

    async BarcodeToBasket(req, res, next) {
        try {
            const barcode = req.body.barcode.replace("Enter", "");
            const option = await DeviceOptions.findOne({where: {gtin: barcode}});

            if (!option) {
                return next(apiError.badRequest("Товар з таким баркодом відсутній"));
            }

            const basketDev = await BasketDevice.findOne({where: {userId: req.user.id, deviceoptionId: option.id}});
            if (!basketDev) {
                await BasketDevice.create({
                    userId: req.user.id, deviceoptionId: option.id, count: 1,
                });
                return res.json({type: "create", option});
            } else {
                await BasketDevice.update({count: basketDev.count + 1}, {
                    where: {
                        id: basketDev.id
                    }
                })
                return res.json({type: "update", id: option.id});
            }

        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }


    async getUserBasketDevices(req, res, next) {
        try {
            const {language} = req.body;
            await BasketDevice.findAll({
                where: {userId: req.user.id},
                order: [['id', 'ASC'], [DeviceOptions, Device, DeviceOptions, 'index', 'ASC'], [DeviceOptions, DeviceImage, 'index', 'ASC']],
                attributes: ['count', 'deviceoptionId', 'id'],
                include: [{
                    model: DeviceOptions,
                    attributes: ['optionName_ru', 'optionName', 'count', 'price', 'saleprice', 'id', 'index', 'weight', 'gtin', 'sell_type'],
                    include: [{
                        model: DeviceImage, attributes: ['image']
                    }, {
                        model: Device,
                        attributes: ['name', 'active', "id", 'series', "name_ru", "series_ru"],
                        include: [{
                            model: DeviceOptions, attributes: ['count']
                        }, {
                            model: ParfumePart, attributes: ["partcount"]
                        }, {
                            model: Brand, attributes: ['name']
                        }, {
                            model: Product_Category, include: [{
                                model: Category,
                                as: 'category',
                                where: {parentId: null}
                            }]
                        },

                        ]

                    }]
                },]
            }).then((basketDevice) => {
                let basketArray = [];
                for (const basketElem of basketDevice) {
                    let stock = false;
                    let deviceElem = basketElem.deviceoption.device;
                    if (basketElem.deviceoption.count > 0 || basketElem.deviceoption.sell_type === "preorder" || basketElem.deviceoption.sell_type === "storage"
                        || (basketElem.deviceoption.sell_type === "on_tab" && deviceElem.parfumepart.partcount >= basketElem.deviceoption.weight)) {
                        stock = true;
                    }
                    const brand = language && deviceElem.brand.name_ru ? deviceElem.brand.name_ru : deviceElem.brand.name
                    const name = language && deviceElem.name_ru ? deviceElem.name_ru : deviceElem.name
                    const series = language && deviceElem.series_ru ? deviceElem.series_ru : deviceElem.series
                    const optionName = language && basketElem.deviceoption.optionName_ru ? basketElem.deviceoption.optionName_ru : basketElem.deviceoption.optionName
                    basketArray.push({
                        brand: brand,
                        category: language && deviceElem.product_categories[0]?.category.name_ru ? deviceElem.product_categories[0]?.category.name_ru : deviceElem.product_categories[0]?.category.name,
                        name: `${name} ${optionName}`,
                        series: series,
                        count: basketElem.count,
                        deviceoptionId: basketElem.deviceoptionId,
                        deviceId: deviceElem.id,
                        gtin: basketElem.deviceoption.gtin,
                        stock,
                        price: basketElem.deviceoption.price,
                        saleprice: basketElem.deviceoption.saleprice,
                        img: basketElem.deviceoption.deviceimages[0]?.image
                    })
                }
                return res.json(basketArray);
            });
        } catch (e) {
            TelegramMsg("TECH", `getUserBasketDevices ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }


    async deleteDevice(req, res, next) {
        try {
            const {deviceoptionId} = req.params;
            await BasketDevice.destroy({where: {userId: req.user.id, deviceoptionId: deviceoptionId}})
            return res.json("Товар видалено з вашого кошика");
        } catch (e) {
            TelegramMsg("TECH", `deleteDevice ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async deleteAll(req, res, next) {
        try {
            await BasketDevice.destroy({where: {userId: req.user.id}})
            return res.json("Кошик порожній");
        } catch (e) {
            TelegramMsg("TECH", `deleteAll ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
}

module.exports = new BasketController();
