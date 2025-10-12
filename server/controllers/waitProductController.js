const {
    WaitProducts, WishList, DeviceOptions, Device,User
} = require("../models/models");
const TelegramMsg = require("../functions/TelegramMsg");
const apiError = require("../error/apierror");


class waitProductController {

    async add(req, res, next) {
        try {
            const {product, place, type} = req.body;

            if (!product || !place || type) {
                return next(apiError.badRequest("Вкажіть усі данні"));
            }

            const wait = await WaitProducts.create({
                product, place, type
            })
            if (wait) {
                return res.json({
                    createdAt: wait.createdAt,
                    id: wait.id,
                    place: wait.place,
                    type: wait.type,
                    product: wait.product,
                    updatedAt: wait.updatedAt
                });
            } else {
                return next(apiError.badRequest("Помилка створення товару очікування"));
            }

        } catch (e) {
            TelegramMsg("TECH", `add waitProduct ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async edit(req, res, next) {
        try {
            const {id, product, place, type} = req.body;

            if (!product || !place || type || id) {
                return next(apiError.badRequest("Вкажіть усі данні"));
            }

            const wait = await WaitProducts.update(
                {product, place, type},
                {where: {id}})

            return res.json(wait);

        } catch (e) {
            TelegramMsg("TECH", `edit waitProduct ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getAllList(req, res, next) {
        try {
            const waitList = await WaitProducts.findAll({
                order: [['type', 'ASC'], ['id', 'ASC']],
            });
            return res.json(waitList);
        } catch (e) {
            TelegramMsg("TECH", `getAllList waitProduct ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getUserWishList(req, res, next) {
        try {
            const wishList = await WishList.findAll({
                order:[['id', 'DESC']],
                where: {notifyInStock: true}, include: [{
                    model: DeviceOptions, attributes: ['optionName'], include: [{
                        model: Device, attributes: ['name']
                    }]
                }, {
                    model: User, attributes: ['firstname', 'phone']
                }]
            });
            return res.json(wishList);
        } catch (e) {
            TelegramMsg("TECH", `getUserWishList ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }


    async delete(req, res, next) {
        const {id} = req.params;
        try {

            if (id) {
                return next(apiError.badRequest("Невірний ід"));
            }

            await WaitProducts.destroy({where: {id}})
            return res.json("Видалено");
        } catch (e) {
            TelegramMsg("TECH", `deleteOne ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

}

module.exports = new waitProductController();
