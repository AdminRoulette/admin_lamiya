const {Brand, Search, Seo} = require('../models/models');
const Transliterations = require("../functions/SearchComponents/Transliterations");
const TelegramMsg = require("../functions/TelegramMsg");
const apiError = require("../error/apierror");
const {Op, DataTypes} = require("sequelize");

class BranController {
    async create(req, res, next) {
        try {
            const {name, name_ru,code, popular} = req.body;
            const OldBrand = await Brand.findOne({where: {name}});
            if (OldBrand) {
                return next(apiError.badRequest("Бренд вже існує"));
            } else {
                const brand = await Brand.create({name, name_ru, popular, code});
                await Seo.create({
                    url: `/brand/${code}`,
                    title: `${name} - купити парфуми бренду | Lamiya.com.ua`,
                    header: name,
                    desc: `Купити парфуми ${name} на Lamiya.com.ua: безкоштовна доставка від 799 грн, низька ціна і гарний вибір`
                })

                await Seo.create({
                    url: `/ru/brand/${code}`,
                    title: `${name_ru} - купить духи бренда | Lamiya.com.ua`,
                    header: name_ru,
                    desc: `Купить духи ${name_ru} на Lamiya.com.ua: бесплатная доставка от 799 грн, низкие цены и хороший выбор`
                })

                return res.json(brand);
            }
        } catch (e) {
            TelegramMsg("TECH", `create brand ${e.message}`)
            next(apiError.badRequest("Помилка при додаванні бренду"));
        }
    }

    async edit(req, res, next) {
        try {
            const {name, name_ru, id, popular,code} = req.body;
            const OldBrand = await Brand.findOne({where: {id}});
            if (OldBrand) {
                await Brand.update({name, popular, name_ru, code}, {where: {id}});
                await Seo.update({
                    url: `/brand/${code}`,
                    title: `${name} - купити парфуми бренду | Lamiya.com.ua`,
                    header: name,
                    desc: `Купити парфуми ${name} на Lamiya.com.ua: безкоштовна доставка від 799 грн, низька ціна і гарний вибір`
                }, {where: {url: `/brand/${OldBrand.code}`}})

                await Seo.update({
                    url: `/ru/brand/${code}`,
                    title: `${name_ru} - купить духи бренда | Lamiya.com.ua`,
                    header: name_ru,
                    desc: `Купить духи ${name_ru} на Lamiya.com.ua: бесплатная доставка от 799 грн, низкие цены и хороший выбор`
                }, {where: {url: `/ru/brand/${OldBrand.code}`}})
                return res.json("Змінено");
            } else {
                return next(apiError.badRequest("Бренд не знайдено"));
            }
        } catch (e) {
            TelegramMsg("TECH", `edit brand ${e.message}`)
            next(apiError.badRequest("Помилка оновлення бренду"));
        }
    }

    async getAll(req, res, next) {
        try {
            const brand = await Brand.findAll({order: [["name", "ASC"]]});
            return res.json(brand);
        } catch (e) {
            TelegramMsg("TECH", `getAll brand ${e.message}`)
            next(apiError.badRequest("Помилка отримання брендів"));
        }
    }

}

module.exports = new BranController();
