const apiError = require("../error/apierror");
const TelegramMsg = require("../functions/TelegramMsg");
const {Op, DataTypes} = require("sequelize");
const {FopsList, Collection, User, Shops, Expenses} = require("../models/models");

class financeController {

    async createExpenses(req, res, next) {
        const {money, type, name, shopId} = req.body;
        try {
            let expenses = await Expenses.create({money, type, name});
            if(shopId){
                await Collection.create({user_id: req.user.id, cash_count:money, shop_id:shopId,comment:name});
                const shop = await Shops.findOne({where: {id: shopId}});
                await Shops.update(
                    {cash: shop.cash - money},
                    {where: {id: shopId}}
                );
            }
            return res.json(expenses);
        } catch (e) {
            TelegramMsg("TECH",`Expenses create ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async updateExpenses(req, res, next) {
        const {id,type,money,name} = req.body;
        try {
            let expenses = await Expenses.update({type,money,name},{where:{id}});
            return res.json(expenses);
        } catch (e) {
            TelegramMsg("TECH", `update expenses ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getAllExpenses(req, res,next) {
        try {
            const {offset} = req.query;
            const limit = 20;
            const expenses = await Expenses.findAll(
                {
                    order: [["id", "DESC"]],
                    limit:limit,
                    offset:offset * limit,
                }
            );
            return res.json(expenses);
        } catch (e) {
            TelegramMsg("TECH",`Expenses getAll ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }


    async getFopsList(req, res, next) {
        try {
            const fopsList = await FopsList.findAll(
                {
                    order: [["id", "DESC"]]
                }
            );

            let fops = [];
            for(const fopItem of fopsList) {
                fops.push({
                    id: fopItem.id,
                    name: fopItem.name,
                    ipn: fopItem.ipn,
                    iban: fopItem.iban,
                    np_city_ref: fopItem.np_city_ref,
                    np_sender_ref: fopItem.np_sender_ref,
                    np_sender_address_ref: fopItem.np_sender_address_ref,
                    np_sender_contact_ref: fopItem.np_sender_contact_ref,
                    ukr_sender_uuid: fopItem.ukr_sender_uuid,
                    sender_phone: fopItem.sender_phone,
                    total_sell: fopItem.total_sell,
                    key: fopItem.key,
                    np_api_key: fopItem.np_api_key,
                    ukr_token: fopItem.ukr_token,
                    ukr_tracking_token: fopItem.ukr_tracking_token,
                    ukr_bearer: fopItem.ukr_bearer
                });
            }

            return res.json(fops);
        } catch (e) {
            TelegramMsg("TECH", `getFopsList ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async editFop(req, res, next) {
        const {id,name, ipn,iban,sender_phone,total_sell,np_city_ref,np_sender_ref,np_sender_address_ref,
            np_sender_contact_ref,ukr_sender_uuid,key,np_api_key,ukr_token,ukr_tracking_token,ukr_bearer} = req.body.value;
        try {
            let fop = await FopsList.update({name, ipn,iban,sender_phone,total_sell,np_city_ref,np_sender_ref,np_sender_address_ref,
                np_sender_contact_ref,ukr_sender_uuid,key,np_api_key,ukr_token,ukr_tracking_token,ukr_bearer},{where:{id}});
            return res.json(fop);
        } catch (e) {
            TelegramMsg("TECH", `editFop ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async createFop(req, res, next) {
        const {name, ipn,iban,sender_phone,total_sell,np_city_ref,np_sender_ref,np_sender_address_ref,
            np_sender_contact_ref,ukr_sender_uuid,key,np_api_key,ukr_token,ukr_tracking_token,ukr_bearer} = req.body.value;
        try {
            let fop = await FopsList.create({name, ipn,iban,sender_phone,total_sell,np_city_ref,np_sender_ref,np_sender_address_ref,
                np_sender_contact_ref,ukr_sender_uuid,key,np_api_key,ukr_token,ukr_tracking_token,ukr_bearer});
            return res.json(fop);
        } catch (e) {
            TelegramMsg("TECH", `createFop ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getCollection(req, res, next) {
        try {
            const collection = await Collection.findAll(
                {
                    order: [["id", "DESC"]], limit: 20,
                    attributes: ['cash_count', 'id', 'comment', 'createdAt'],
                    include: [
                        {
                            model: User,
                            attributes: ['lastname', 'firstname']
                        },
                        {
                            model: Shops,
                            attributes: ['city', 'address']
                        }
                    ]
                }
            );
            return res.json(collection);
        } catch (e) {
            TelegramMsg("TECH", `supply getAll ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async createCollection(req, res, next) {
        const {shop_id, cash_count,comment} = req.body;
        try {
            let collection = await Collection.create({user_id: req.user.id, cash_count, shop_id,comment});
            const shop = await Shops.findOne({where: {id: shop_id}});
            await Shops.update(
                {cash: shop.cash - cash_count},
                {where: {id: shop_id}}
            );
            return res.json({
                ...collection.dataValues,
                shop: {city: shop.city, address: shop.address},
                user: {lastname: req.user.lastname, firstname: req.user.firstname}
            });
        } catch (e) {
            TelegramMsg("TECH", ` Supply add ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
}

module.exports = new financeController();