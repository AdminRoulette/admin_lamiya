const {PromoCodes} = require("../models/models");
const TelegramMsg = require("../functions/TelegramMsg");
const apiError = require("../error/apierror");

class OrdersController {


    async createPromoCode(req, res,next) {
        try {
            const {code, privacy, percent, sum, count, expdate,minOrder} = req.body;
            await PromoCodes.create({code, privacy, percent, sum, count, expdate,minOrder});
            return res.json("Промо створене");
        } catch (e) {
            TelegramMsg("TECH",`createPromoCode ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async checkPromoCode(req, res,next) {
        try {
            const {code,language} = req.body;
            await PromoCodes.findOne({
                attributes: ["code", "id", "percent", "sum", "count", "expdate","minOrder"],
                where: {code: code}
            }).then(async (codeElem) => {
                if (codeElem) {
                    if (new Date().getTime() > new Date(codeElem.expdate).getTime() || codeElem.count === 0) {
                        if (new Date().getTime() > new Date(codeElem.expdate).getTime()) {
                            return next(apiError.badRequest(language.isLanguage?"Срок действия промокода исчерпан":"Термін дії промокоду вичерпано"));
                        }
                        if (codeElem.count === 0) {
                            return next(apiError.badRequest(language.isLanguage?"Кол-во использований исчерпано":"Кіл-сть використань вичерпана"));
                        }
                    } else {
                        return res.json(codeElem);
                    }
                } else {
                    return next(apiError.badRequest(language.isLanguage?"Промокод не найден":"Промокод не знайдено"));
                }
            });
        } catch (e) {
            TelegramMsg("TECH",`checkPromoCode ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }


    async getAllPromoCodes(req, res,next) {
        try {
            const promo = await PromoCodes.findAll({});
            return res.json(promo);
        } catch (e) {
            TelegramMsg("TECH",`getAllPromoCodes ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getOnePromoCodes(req, res,next) {
        try {
            const {id} = req.params;
            const promo = await PromoCodes.findOne({
                where: {id}
            });
            return res.json(promo);
        } catch (e) {
            TelegramMsg("TECH",`getOnePromoCodes ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }


}


module.exports = new OrdersController();
