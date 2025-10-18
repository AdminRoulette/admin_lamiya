const {
    Supply,
    Orders,
    Brand,
    DeviceImage,
    DeviceOptions,
    Category,
    ParfumePart,
    Device,
    OrderDevice,
    Product_Category,
    Collection,
    User,
    Shops,
    StockHistory,
    SupplyProducts,
    PriceTags
} = require("../models/models");
const apiError = require("../error/apierror");
const {Op, literal, Sequelize, DataTypes} = require("sequelize");
const TelegramMsg = require("../functions/TelegramMsg");
const stockEmail = require("../functions/Emails/stockEmail");
const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");
const axios = require("axios");

class SupplyController {

    async getProducts(req, res, next) {
        try {
            const {name, brandId, company} = req.query;
            const products = await Device.findAll({
                order: [[DeviceOptions, DeviceImage, "index", "ASC"], [DeviceOptions, "index", "ASC"]],
                attributes: ['name', 'series', 'id', 'company', 'brandId'],
                where: {
                    active: !company, ...(name && {[Op.or]: [{name: {[Op.iLike]: `%${name}%`}}, {series: {[Op.iLike]: `%${name}%`}}]}), ...(brandId && {brandId}), ...(company && {company}),
                },
                include: [{
                    model: DeviceOptions,
                    where: {on_tab: false, sell_bottle: false},
                    attributes: ['optionName', 'id', 'startPrice', 'count', "marketPrice", 'price', 'index'],
                    include: [{model: DeviceImage, attributes: ['image',"index"]}]
                }]
            });

            let productList = [];
            for (const product of products) {
                let total_sell_rate = 0;
                let options = [];
                for (const option of product.deviceoptions) {

                    let sell_count = 0;
                    const order_devices = await OrderDevice.findAll({
                        attributes: ['count'], where: {
                            option_id: option.id,
                            createdAt: {[Op.gte]: literal('CURRENT_TIMESTAMP - INTERVAL \'60 days\'')}
                        }, include: [{
                            model: Orders,
                            required: true,
                            attributes: ['status_id'],
                            where: {status_id: {[Op.notIn]: ['cancelled', 'cancelled-us', 'refused-return', 'refused']}}
                        }]
                    });

                    for (const order_device of order_devices) {
                        sell_count += order_device.count;
                    }
                    total_sell_rate = option.count - sell_count;

                    options.push({
                        id: option.id,
                        optionName: option.optionName,
                        startPrice: option.startPrice,
                        price: option.price, ...(option.marketPrice && {marketPrice: option.marketPrice}),
                        image: option.deviceimages[0]?.image,
                        sell_count: sell_count,
                        count: option.count
                    })
                }
                productList.push({
                    options, total_sell_rate, name: `${product.name} ${product.series}`
                })
            }

            return res.json(productList);

        } catch (e) {
            TelegramMsg("TECH", `getProducts ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getSupplyLongInfo(req, res, next) {
        try {
            const {id} = req.query;

            const supply_products = await SupplyProducts.findAll({
                attributes: ['id', 'price', 'count', 'sell_price', 'market_price'],
                order: [['id', "ASC"], [DeviceOptions, DeviceImage, "index", "ASC"]],
                where: id ? {supply_id: id} : {user_id: req.user.id, supply_id: null},
                include: [{
                    model: DeviceOptions,
                    attributes: ['optionName', 'id'],
                    include: [{model: DeviceImage, attributes: ['image']}, {
                        model: Device,
                        attributes: ['name', 'series']
                    }]
                }]
            });

            let productList = [];
            for (const supply_product of supply_products) {
                const deviceElement = supply_product.deviceoption.device;
                productList.push({
                    count: supply_product.count,
                    price: supply_product.price,
                    sell_price: supply_product.sell_price,
                    market_price: supply_product.market_price,
                    id: supply_product.id,
                    option_id: supply_product.deviceoption.id,
                    name: `${deviceElement.name} ${deviceElement.series} ${supply_product.deviceoption.optionName}`,
                    image: supply_product.deviceoption.deviceimages[0]?.image,
                })
            }

            return res.json(productList);

        } catch (e) {
            TelegramMsg("TECH", `getSupplyLongInfo ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async PrintSupplyExcel(req, res, next) {
        try {
            const {id} = req.query;
            const supplyProducts = await SupplyProducts.findAll({
                where: {supply_id: id}, include: [{
                    model: DeviceOptions, attributes: ['optionName'], include: [{
                        model: Device,
                        attributes: ['company', 'name', 'series']
                    }]
                }]
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Замовлення');
            worksheet.columns = [{key: 'name', width: 80}, {key: 'count', width: 15},];


            supplyProducts.forEach((product, index) => {
                worksheet.addRow({
                    name:`${product.deviceoption.device.name} ${product.deviceoption.device.series} ${product.deviceoption.optionName}`,
                    count: product.count,
                });
                const rowNumber = index + 1;
                const row = worksheet.getRow(rowNumber);

                // Застосовуємо стиль до всього рядка
                row.font = {name: 'Arial', size: 10};
                row.alignment = {horizontal: 'left', vertical: 'middle'};
            })

            const buffer = await workbook.xlsx.writeBuffer();
            res.setHeader('Content-Disposition', 'attachment; filename="generated.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            return res.send(buffer);
        } catch (e) {
            TelegramMsg("TECH", `PrintSupplyExcel ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async deleteProductSupply(req, res, next) {
        try {
            const {id} = req.query;
            if (!id) {
                return next(apiError.badRequest("Невистачає данних"));
            }
            await SupplyProducts.destroy({where: {id}});
            return res.json("done");
        } catch (e) {
            TelegramMsg("TECH", `deleteProductSupply ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async EditSupply(req, res, next) {
        try {
            const {comment, invoice, extra_costs, company, deposit, id} = req.body;

            const supply = await Supply.findOne({where: {id}});
            let cost = 0;

            if (supply.status === 'done') {
                return next(apiError.badRequest("Поставка вже виконана!"));
            }

            if (!company || !id) {
                return next(apiError.badRequest("Невистачає данних"));
            }

            const supplyProducts = await SupplyProducts.findAll({where: {supply_id: supply.id}});

            if (!deposit) {
                for (const product of supplyProducts) {
                    cost += product.price * product.count;
                }
            }

            await Supply.update({
                comment, invoice, extra_costs, company, cost, deposit
            }, {where: {id: supply.id}});

            return res.json({cost});
        } catch (e) {
            TelegramMsg("TECH", `EditSupply ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async ApproveSupply(req, res, next) {
        try {
            const {id} = req.body;

            const supplyProducts = await SupplyProducts.findAll({where: {supply_id: id}});

            for (const product of supplyProducts) {

                const option = await DeviceOptions.findOne({
                    where: {id: product.option_id},
                    include: [{
                        model: Device, attributes: ["stock"],
                    }]
                });

                if ((product.sell_price !== option.price)) {
                    await PriceTags.create({
                        option_id: option.id, shop_id: 1,
                        type: `Зміна ціни при поставці #${id}`
                    });
                }

                const new_count = product.count + option.count;
                let new_price = product.price;

                if (option.count > 0) {
                    new_price = ((option.startPrice * option.count) + (product.price * product.count)) / new_count;
                }

                await DeviceOptions.update({
                    count: new_count,
                    startPrice: Math.ceil(new_price),
                    price: product.sell_price,
                    marketPrice: product.market_price
                }, {where: {id: product.option_id}});

                await StockHistory.create({
                    option_id: product.option_id,
                    order_id: null,
                    old_count: option.count,
                    new_count: new_count,
                    user_id: req.user.id,
                    action: "Постачання",
                })

                if (!option.device.stock) {
                    await Device.update({stock: true}, {where: {id: option.deviceId}});
                    await axios.post(`http://localhost:9200/products/_update/${option.deviceId}`, {
                        doc:{
                            stock:true
                        }
                    },{
                        auth: {
                            username: 'elastic',
                            password: process.env.ELASTIC_PASS,
                        }
                    }).catch(()=>{});
                }
            }

            await Supply.update({status: 'done'}, {where: {id}});

            return res.json("done");
        } catch (e) {
            TelegramMsg("TECH", `ApproveSupply ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async CreateSupply(req, res, next) {
        try {
            const {comment, invoice, extra_costs, company, deposit} = req.body;

            const supplyProducts = await SupplyProducts.findAll({where: {supply_id: null, user_id: req.user.id}});

            let cost = 0;
            if (!company || supplyProducts?.length === 0) {
                return next(apiError.badRequest("Невистачає данних"));
            }

            if (!deposit) {
                for (const product of supplyProducts) {
                    cost += product.price * product.count;
                }
            }

            const supply = await Supply.create({
                comment, invoice, extra_costs, company, user_id: req.user.id, cost, deposit
            });
            await SupplyProducts.update({supply_id: supply.id}, {where: {supply_id: null, user_id: req.user.id}});
            return res.json("done");
        } catch (e) {
            TelegramMsg("TECH", `CreateSupply ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async editProductToSupply(req, res, next) {
        try {
            const {option_id, price, count, sell_price, market_price} = req.body;

            if (!option_id || !price || !count) {
                return next(apiError.badRequest("Невистачає данних"));
            }

            const supplyProduct = await SupplyProducts.findOne({where: {option_id: option_id,user_id: req.user.id}});

            if (supplyProduct) {
                await SupplyProducts.update({
                    price, count, sell_price, market_price: market_price ? market_price : 0
                }, {where: {option_id: option_id,user_id: req.user.id}});
            }
            return res.json("done");
        } catch (e) {
            TelegramMsg("TECH", `editProductToSupply ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async addProductToSupply(req, res, next) {
        const {option_id, price, count, sell_price, market_price} = req.body;

        try {
            if (!option_id || !price || !count) {
                return next(apiError.badRequest("Невистачає данних"));
            }
            await SupplyProducts.create({
                option_id: +option_id,
                user_id: req.user.id,
                price,
                count,
                sell_price,
                market_price: market_price ? market_price : 0
            });

            return res.json("done");
        } catch (e) {
            TelegramMsg("TECH", `addProductToSupply ${option_id}, ${price}, ${count}, ${sell_price}, ${market_price}. ${e.message}`);
            next(apiError.badRequest(e.message));
        }
    }

    async getSupplyList(req, res, next) {
        try {
            const {offset, option_id, company} = req.query;
            const limit = 20;
            let where = company ? {company} : {};

            if (option_id) {
                const supply_products = await SupplyProducts.findAll({
                    where: {option_id: option_id}
                });
                const ids = supply_products.map(product => product.id);
                where = {...where, id: {[Op.in]: ids}}
            }

            const supply = await Supply.findAll({
                order: [["id", "DESC"]], where, limit: limit, offset: offset * limit, include: [{model: User}]
            });
            return res.json(supply);

        } catch (e) {
            TelegramMsg("TECH", `getSupplyList ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

}

module.exports = new SupplyController();
