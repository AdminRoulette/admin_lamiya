const bcrypt = require('bcrypt');
const {User, Basket, UserStats, Cashiers, FopsList, Shops} = require('../models/models');
const jwt = require('jsonwebtoken');
const apiError = require("../error/apierror");
const nodemailer = require('nodemailer');
const {Op} = require("sequelize");
const TelegramMsg = require("../functions/TelegramMsg");

const generateJwt = (id, email, role, profileImage, fullName, firstname, lastname, phone) => {
    return jwt.sign(
        {id, email, role, profileImage, fullName, firstname, lastname, phone},
        process.env.SECRET_KEY,
        {expiresIn: '365d'}
    );
}

class UserController {

    async loginGoogle(req, res, next) {
        const {credential} = req.body;
        try {
            if (!credential) {
                return next(apiError.PreconditionFailed("Google повернув не коректні дані"));
            }
            const googleUser = jwt.decode(credential, "");
            const userFindOne = await User.findOne({where: {email: googleUser.email.toLowerCase()}});
            if (userFindOne) {
                const token = generateJwt(userFindOne.id, userFindOne.email, userFindOne.role, userFindOne.profileImage, userFindOne.fullname, userFindOne.firstname, userFindOne.lastname, userFindOne.phone);
                return res.json({token});
            } else {
                const CreatedUser = await User.create({
                    email: googleUser.email.toLowerCase(),
                    role: "USER",
                    password: "",
                    profileImage: googleUser.picture,
                    firstname: googleUser.given_name,
                    lastname: googleUser.family_name ? googleUser.family_name : "",
                    fullname: googleUser.name
                });
                await User.update({ref: CreatedUser.id}, {where: {id: CreatedUser.id}});
                await Basket.create({userId: CreatedUser.id});
                const token = generateJwt(CreatedUser.id, CreatedUser.email, CreatedUser.role, CreatedUser.profileImage, CreatedUser.fullname, CreatedUser.firstname, CreatedUser.lastname, CreatedUser.phone);
                return res.json({token});
            }
        } catch (e) {
            TelegramMsg("TECH", `loginGoogle ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }


    async check(req, res, next) {
        try {
            const auth_token = req.headers.authorization.split(' ')[1]
            if (!auth_token) {
                return next(apiError.Unauthorized("Unauthorized"));
            }
            try {
                const decoded = jwt.verify(auth_token, process.env.SECRET_KEY)
                const user = await User.findOne({where: {id: decoded.id}})
                const token = generateJwt(user.id, user.email, user.role, user.profileImage, user.fullname, user.firstname, user.lastname, user.phone)
                return res.json({token})
            } catch (e) {
                return next(apiError.Unauthorized("Token not valid"));
            }
        } catch (e) {
            TelegramMsg("TECH", `check ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async changeUserStatsComment(req, res, next) {
        try {
            const {comment, id} = req.body

            const user_stats = await UserStats.findOne({where: {id}});

            if (user_stats) {
                await UserStats.update({comment}, {where: {id}});
                return res.json({comment: comment})
            } else {
                return next(apiError.badRequest("Користувача не знайдено"));
            }
        } catch (e) {
            TelegramMsg("TECH", `getUserStats ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getUserStats(req, res, next) {
        try {
            const {phone} = req.query
            const PHONE_REGEXP = /^[+38]{3}[0-9]+$/;
            if (!phone || !phone.match(PHONE_REGEXP)) {
                return next(apiError.badRequest("Телефон вказаний невірно"));
            }

            const user_stats = await UserStats.findOne({where: {phone}});

            if (user_stats) {
                return res.json({
                    completed_orders: user_stats.completed_orders,
                    completed_percent: user_stats.completed_percent,
                    failed_orders: user_stats.failed_orders,
                    comment: user_stats.comment,
                })
            } else {
                return next(apiError.badRequest("Користувача не знайдено"));
            }
        } catch (e) {
            TelegramMsg("TECH", `getUserStats ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getAllUsersStats(req, res, next) {
        try {
            const {phone, offset} = req.query

            const user_stats = await UserStats.findAndCountAll({
                order:[["id",'DESC']],
                where: phone ? {phone: {[Op.iLike]: `%${phone}`}} : {},
                limit: 50,
                offset:offset * 50,
            });

            return res.json(user_stats)
        } catch (e) {
            TelegramMsg("TECH", `getAllUsersStats ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async createUser(req, res, next) {
        try {
            const {email, role, lastname, firstname, phone} = req.body

            if (!(email && role && lastname && firstname && phone)) {
                return next(apiError.badRequest("Вкажіть усі данні"));
            }
            const PHONE_REGEXP = /^[+38]{3}[0-9]+$/;
            if (!phone.match(PHONE_REGEXP)) {
                return next(apiError.badRequest("Телефон вказаний невірно"));
            }
            const candidate = await User.findOne({
                where: {
                    [Op.or]: [
                        {email: email.toLowerCase()}, {phone}
                    ]
                }
            });
            if (candidate) {
                return next(apiError.PreconditionFailed("Користувач з таким телефоном чи ел. поштою вже існує"));
            }

            const user = await User.create({
                email,
                role,
                lastname,
                firstname,
                phone,
                fullname: `${lastname} ${firstname}`
            });
            await User.update({ref: user.id}, {where: {id: user.id}});
            return res.json({...user, ref: user.id});

        } catch (e) {
            TelegramMsg("TECH", `allUsers ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async changeUser(req, res, next) {
        try {
            const {id, email, role, lastname, firstname, phone, ref} = req.body

            if (!(id && email && role && lastname && firstname && phone && ref)) {
                return next(apiError.badRequest("Вкажіть усі данні"));
            }
            const PHONE_REGEXP = /^[+38]{3}[0-9]+$/;
            if (!phone.match(PHONE_REGEXP)) {
                return next(apiError.badRequest("Телефон вказаний невірно"));
            }

            const user = await User.findOne({where: {id}});
            if (!user) {
                return next(apiError.badRequest("Не вдалося знайти користувача"));
            }
            await User.update({
                email,
                role,
                lastname,
                firstname,
                phone,
                ref,
                fullname: `${lastname} ${firstname}`
            }, {where: {id}});

            return res.json({email, role, lastname, firstname, phone, ref})

        } catch (e) {
            TelegramMsg("TECH", `allUsers ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async allUsers(req, res, next) {
        try {
            const {phone, offset, role} = req.query
            let where = {};
            if (phone) {
                where = {phone: {[Op.iLike]: `%${phone}`}};
            }
            if (role) {
                const roleWhere = role === "ALL" ? {[Op.not]: `USER`} : {[Op.iLike]: `%${role}%`}
                where = {...where, role: roleWhere};
            }

            const users = await User.findAndCountAll({
                where,
                offset: phone || role ? 0 : offset * 50,
                limit: 50
            });

            return res.json(users)

        } catch (e) {
            TelegramMsg("TECH", `allUsers ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async createCashiers(req, res, next) {
        try {
            const {fop_id, shop_id, userId} = req.body

            if (!(shop_id && fop_id)) {
                return next(apiError.badRequest("Вкажіть усі данні"));
            }
            const cashier = await Cashiers.findOne({where: {userId,shop_id,fop_id}});
            if (cashier) {
                return next(apiError.badRequest("Касира вже існує"));
            }
            const new_cashier = await Cashiers.create({fop_id, shop_id,userId});

            return res.json(new_cashier)

        } catch (e) {
            TelegramMsg("TECH", `createCashiers ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async changeCashier(req, res, next) {
        try {
            const {id, fop_id, shop_id} = req.body

            if (!(shop_id && fop_id && id)) {
                return next(apiError.badRequest("Вкажіть усі данні"));
            }
            const cashier = await Cashiers.findOne({where: {id}});
            if (!cashier) {
                return next(apiError.badRequest("Касира не знайдено"));
            }
            await Cashiers.update({fop_id, shop_id}, {where: {id}});

            return res.json({fop_id, shop_id})

        } catch (e) {
            TelegramMsg("TECH", `changeCashier ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async deleteCashier(req, res, next) {
        try {
            const {id} = req.query

            if (!id) {
                return next(apiError.badRequest("Вкажіть ід касира"));
            }
            const cashier = await Cashiers.findOne({where: {id}});
            if (!cashier) {
                return next(apiError.badRequest("Касира не знайдено"));
            }
            await Cashiers.destroy({where: {id}});

            return res.json("Касира видалено")

        } catch (e) {
            TelegramMsg("TECH", `deleteCashier ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async allCashiers(req, res, next) {
        try {
            const {offset, shop_id, fop_id} = req.query
            let where = {};

            if (shop_id) {
                where = {...where, shop_id: shop_id};
            }
            if (fop_id) {
                where = {...where, fop_id: fop_id};
            }

            const users = await Cashiers.findAndCountAll({
                where,
                include: [
                    {model: User, attributes: ['lastname', 'firstname']},
                    {model: FopsList, attributes: ['name']},
                    {model: Shops, attributes: ['address']}
                ],
                offset: offset * 50,
                limit: 50
            })

            return res.json(users)

        } catch (e) {
            TelegramMsg("TECH", `allCashiers ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

}


module.exports = new UserController();
