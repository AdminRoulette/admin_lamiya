const {Rating, Device, RatingReply, User, RatingImage, Brand} = require('../models/models');
const S3 = require("aws-sdk/clients/s3");

const apiError = require("../error/apierror");
const TelegramMsg = require("../functions/TelegramMsg");
const accessKeyId = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

class RatingController {

    async getAll(req, res, next) {
        try {
            let rating = await Rating.findAndCountAll({
                order:[['id','DESC']],
                where: {moderation: false}, include: [{
                    model: Device, attributes: ['id', 'name', 'link']}, {model: RatingImage, attributes: ['img']}]
            });

            let reply = await RatingReply.findAndCountAll({
                order:[['id','DESC']],
                where: {replymoderation: false}, include: [{
                    model: Rating, include: [{
                        model: Device,
                        attributes: ['id', 'name', 'link'],
                        include: [{model: Brand, attributes: ['name','id']},]
                    }],
                }]
            });

            let arr = [rating.rows, reply.rows];
            return res.json(arr);
        } catch (e) {
            TelegramMsg("TECH", `getAll ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async deleteReply(req, res, next) {
        try {
            const {id} = req.params;
            await RatingReply.findOne({where: {id}}).then(async (data) => {
                if (data) {
                    await RatingReply.destroy({where: {id}}).then(async () => {
                        return res.json("Видалено");
                    });
                } else {
                    return res.json("This RatingReply doesn't exist in DB");
                }
            });
        } catch (e) {
            TelegramMsg("TECH", `deleteReply ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async deleteRating(req, res, next) {
        try {
            const {id} = req.params;
            await Rating.findOne({
                where: {id}, include: [{model: RatingImage}]

            }).then(async (data) => {
                if (data) {
                    await Rating.destroy({where: {id}}).then(async () => {
                        data.ratingimages.map((ImgElement) => {
                            let s3Link = ImgElement.img.split("https://lamiya.s3.amazonaws.com/")[1];
                            const s3 = new S3({
                                region: 'eu-central-1', accessKeyId, secretAccessKey
                            })
                            s3.deleteObject({
                                Bucket: "lamiya", Key: `${s3Link}`
                            }, function (err, data) {
                            })
                        })
                        await RatingReply.findOne({where: {ratingId: id}}).then(async (reply) => {
                            if (reply) {
                                await RatingReply.destroy({where: {ratingId: id}}).then(async () => {
                                    return res.json("Видалено");
                                });
                            } else {
                                return res.json("This Reply doesn't exist in DB");
                            }
                        });
                    });
                } else {
                    return res.json("This Rating doesn't exist in DB");
                }
            });
        } catch (e) {
            TelegramMsg("TECH", `deleteRating ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async moderationReply(req, res, next) {
        try {
            const {id} = req.body;
            await RatingReply.findOne({where: {id}}).then(async (data) => {
                if (data) {
                    await RatingReply.update({replymoderation: true}, {where: {id}}).then(async () => {
                        return res.json("updated");
                    });
                } else {
                    return res.json("This RatingReply doesn't exist in DB");
                }
            });

        } catch (e) {
            TelegramMsg("TECH", `moderationReply ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async EditRating(req, res, next) {
        try {
            const {id, comment, video, bought, createdAt} = req.body;
            if (comment.length > 2499 || video.length > 499 || createdAt.length > 255) return next(apiError.badRequest("Невірні дані"));
            await Rating.update({comment, video, bought, createdAt}, {where: {id}}).then(async () => {
                return res.json("Оновлено");
            });
        } catch (e) {
            TelegramMsg("TECH", `moderationReply ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async moderationRating(req, res, next) {
        try {
            const {id} = req.body;
            await Rating.findOne({where: {id}}).then(async (ratingData) => {
                if (ratingData) {
                    await Rating.update({moderation: true}, {where: {id}}).then(async () => {
                        await Device.findOne({where: {id: ratingData.deviceId}}).then(async deviceElem => {
                            let newRating = ((deviceElem.rating * deviceElem.ratingCount) + ratingData.rate) / (deviceElem.ratingCount + 1)
                            await Device.update({
                                rating: parseFloat(newRating.toFixed(2)), ratingCount: deviceElem.ratingCount + 1
                            }, {where: {id: ratingData.deviceId}});
                            return res.json("Рейтинг Оновлено");
                        });
                    });
                } else {
                    return res.json("This rating doesn't exist in DB");
                }
            });

        } catch (e) {
            TelegramMsg("TECH", `moderationRating ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

}

module.exports = new RatingController();
