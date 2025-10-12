const {Brand, Search, Seo, Shops} = require('../models/models');
const Transliterations = require("../functions/SearchComponents/Transliterations");
const TelegramMsg = require("../functions/TelegramMsg");
const apiError = require("../error/apierror");
const {Op, DataTypes} = require("sequelize");

class StoreController {
    async create(req, res, next) {
        try {
            const {city, address, phone, schedule, description, cash} = req.body;
            if (!city ||  !address || !phone) {
                return next(apiError.badRequest("Магазин не знайдено"));
            }

            const brand = await Shops.create({city, address, phone, schedule, description, cash});
            return res.json(brand);
        } catch (e) {
            TelegramMsg("TECH", `create shops ${e.message}`)
            next(apiError.badRequest("Помилка при додаванні магазину"));
        }
    }

    async edit(req, res, next) {
        try {
            const {id, city, address, phone, schedule, description, cash} = req.body;
            if (!city ||  !address || !phone || !id) {
                return next(apiError.badRequest("Магазин не знайдено"));
            }
            const OldShop = await Shops.findOne({where: {id}});
            if (OldShop) {
                await Brand.update({city, address, phone, schedule, description, cash}, {where: {id}});

                return res.json("Змінено");
            } else {
                return next(apiError.badRequest("Магазин не знайдено"));
            }
        } catch (e) {
            TelegramMsg("TECH", `edit brand ${e.message}`)
            next(apiError.badRequest("Помилка оновлення магазину"));
        }
    }

    async getAll(req, res, next) {
        try {
            const shops = await Shops.findAll({
                order: [["city", "ASC"]]
            });
            return res.json(shops);
        } catch (e) {
            TelegramMsg("TECH", `getAll shop ${e.message}`)
            next(apiError.badRequest("Помилка отримання магазинів"));
        }
    }

}

module.exports = new StoreController();
