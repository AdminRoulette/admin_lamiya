const {
    Category, Orders, OrderDevice, Device, Brand, User, Cashiers, ChecksOrder, Product_Category, DeviceOptions, Shops,
    FopsList
} = require('../../models/models');
const apiError = require("../../error/apierror");
const TelegramMsg = require("../../functions/TelegramMsg");
const jwt = require("jsonwebtoken");
const CheckBox = require("../../functions/CheckBox/CheckBox");
const {Op} = require("sequelize");


class CheckBoxController {

    async OpenShift(req, res, next) {
        try {
            const {id} = req.body;
            const userId = id ? id : req.user.id;

            await Cashiers.findOne({
                where: {userId: userId}, include: [{model: User},{model: FopsList}]
            }).then(async cashier => {
                if (cashier?.shift) {
                    return next(apiError.badRequest("Зміну вже відкрито"));
                }
                const shop = await Shops.findOne({where: {id: cashier.shop_id}})
                await CheckBox.statusShifts(cashier.fops_list.key, cashier.bearer).then(async (statusShift) => {
                    if (statusShift.results.length === 0 || statusShift?.results[0]?.status === "CLOSED") {
                        await CheckBox.shift(cashier.fops_list.key, cashier.bearer).then(async (openShifts) => {
                            setTimeout(async () => {
                                if (openShifts.status === "CREATED" || openShifts.status === "OPENED") {
                                    await CheckBox.serviceCash(shop.cash * 100, cashier.fops_list.key, cashier.bearer).then(async () => {
                                        await Cashiers.update({shift: true}, {where: {bearer: cashier.bearer}}).then(() => {
                                            TelegramMsg(cashier.shop_id, `Зміну відкрито. В касі: ${shop.cash} грн`)
                                            TelegramMsg("ORDER", `Зміну відкрито ${cashier.user.lastname} ${cashier.user.firstname}\n<b>${cashier.fops_list.name}</b>`)
                                            return res.json({
                                                open: cashier.shift,
                                                cashier: cashier.user.firstname + ' ' + cashier.user.lastname
                                            });
                                        })
                                    })
                                } else {
                                    TelegramMsg("TECH", `CheckBox: Зміна не відкрилася бо статус - ${openShifts.status}`)
                                    return next(apiError.badRequest(`Зміна не відкрилася бо статус - ${openShifts.status}`));
                                }
                            }, 3000);
                        })
                    } else {
                        if (statusShift.results[0].balance.service_in > shop.cash) {
                            Cashiers.update({shift: true}, {where: {bearer: cashier.bearer}}).then(() => {
                                return res.json({
                                    open: cashier.shift, cashier: cashier.user.firstname + ' ' + cashier.user.lastname
                                });
                            })
                        } else {
                            if (statusShift.results[0].status === "OPENED") {
                                await CheckBox.serviceCash(shop.cash * 100, cashier.fops_list.key, cashier.bearer).then(async () => {
                                    Cashiers.update({shift: true}, {where: {bearer: cashier.bearer}});
                                    return res.json({
                                        open: cashier.shift,
                                        cashier: cashier.user.firstname + ' ' + cashier.user.lastname
                                    });
                                })
                            } else {
                                TelegramMsg("TECH", `CheckBox #2: Зміна не відкрилася бо статус - ${statusShift.results[0].status}`)
                                return next(apiError.badRequest(`Зміна не відкрилася бо статус - ${statusShift.results[0].status}`));
                            }
                        }
                    }
                })
            }).catch((error) => {
                TelegramMsg("TECH", `CheckBox: Касира не знайдено ${error.message}`)
                return next(apiError.badRequest("Касира не знайдено"));
            });
        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }

    async CloseShift(req, res, next) {
        try {
            const {id} = req.body;

            const userId = id ? id : req.user.id;

            await Cashiers.findOne({
                where: {userId: userId}, include: [{model: FopsList},{model: User}]
            }).then(async cashier => {
                await CheckBox.cashRegisterInfo(cashier.fops_list.key).then(async (dataShifts) => {
                    if (dataShifts.has_shift === true) {
                        await CheckBox.report(cashier.fops_list.key, cashier.bearer).then(async (info) => {
                            await CheckBox.serviceCash(info.balance * -1, cashier.fops_list.key, cashier.bearer).then(async () => {
                              await CheckBox.closeShift(cashier.fops_list.key, cashier.bearer).then(async (close) => {
                                    if (close.status === "CLOSING") {
                                        await Cashiers.update({shift: false}, {where: {bearer: cashier.bearer}});
                                        const shop = await Shops.findOne({where: {id: cashier.shop_id}});
                                        let payments = '';
                                        for(const payment of info.payments){
                                            payments+= `${payment.label} - <b><u>${payment.sell_sum/100} грн</u></b>\n`;
                                        }
                                        TelegramMsg(cashier.shop_id, `Зміну закрито.\n\nПовино бути в касі: <b><u>${shop.cash} грн.</u></b>\n`)

                                        TelegramMsg("ORDER", `Зміну ${cashier.user.lastname} ${cashier.user.firstname} закрито.\n<b>${cashier.fops_list.name}</b>\n\nПробито чеків: <b>${info.sell_receipts_count}</b>\n${payments}Повино бути в касі: <b><u>${shop.cash} грн.</u></b>\n`)
                                        return res.json("Зміну закрито");
                                    }
                                })
                            })
                        })
                    }
                })
            }).catch((e) => {
                TelegramMsg("TECH", `CheckBox: Помилка отримання касира ${e.message}`)
                return next(apiError.badRequest("Помилка отримання касира"));
            })
        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }

    async CheckShift(req, res, next) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const userId = jwt.verify(token, process.env.SECRET_KEY).id;
            const cashier = await Cashiers.findOne({
                where: {userId}, include: [{model: User}]
            })
            if (!cashier) {
                return next(apiError.PreconditionFailed("Checkbox: Перевірка зміни"))
            }
            return res.json({open: cashier.shift, cashier: cashier.user.firstname + ' ' + cashier.user.lastname})
        } catch (e) {
            TelegramMsg("TECH", `CheckShift#2 ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async ShiftStats(req, res, next) {
        try {

            const cashier = await Cashiers.findOne({where: {userId:req.user.id}, include: [{model: User},{model: FopsList}]})
            const shop = await Shops.findOne({where: {id: cashier.shop_id}});

            if(cashier && shop){
                await CheckBox.report(cashier.fops_list.key,cashier.bearer).then(async (info) => {
                    let payments = '';
                    for(const payment of info.payments){
                        if(payment.label === 'Картка' || payment.label === "Готівка") {
                            payments += `${payment.label} - <b><u>${payment.sell_sum / 100} грн</u></b>\n`;
                        }
                    }
                    TelegramMsg(cashier.shop_id, `X Звіт по зміні.\n${payments}Повино бути в касі: <b><u>${shop.cash} грн.</u></b>\n`)
                    return res.json("Відправлено")
                })
            }else{
                return next(apiError.badRequest("Не знайшли потрібного касира"));
            }
        } catch (e) {
            TelegramMsg("TECH", `ShiftStats ${e.message}`)
            next(apiError.badRequest("Помилка в зборі статистики"));
        }
    }

    async SetCashierBearer(req, res, next) {
        try {
            const {id,pinCode} = req.body;
            const cashier = await Cashiers.findOne({where: {id}, include: [{model: FopsList}]})
            if(!cashier) {
                return res.json("Касира не знайдено");
            }
            if(!cashier.fops_list.key) {
                return res.json("Касира не прив'язаний до ФОП або ФОП не має ключа");
            }
            await CheckBox.getNewCashierBearer(cashier.fops_list.key,pinCode).then(async (bearer) => {
                if (bearer) {
                    Cashiers.update({bearer: bearer}, {where: {id}});

                    return res.json("Доступ касира оновлено");
                } else {
                    return next(apiError.badRequest("Не вдалося отримати дані від чек бокса"));
                }
            }).catch(error => {
                return next(apiError.badRequest("Не вдалося отримати дані від чек бокса"));
            });
        } catch (e) {
            TelegramMsg("TECH", `SetCashierBearer ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async CreateOrderCheck(req, res, next) {
        try {
            const {orderId} = req.body;
            const auth = req.headers.authorization || "";
            await CheckBox.fullCreateCheck(orderId,auth).then(async (checkuuid) => {
                if (checkuuid) {
                    ChecksOrder.create({
                        checkuuid, orderId
                    })

                    return res.json({
                        checkuuid_list: [{checkuuid}],
                    });
                } else {
                    return next(apiError.badRequest("Не вдалося створити чек"));
                }
            }).catch(error => {
                return next(apiError.badRequest(error.message));
            });
        } catch (e) {
            TelegramMsg("TECH", `CreateOrderCheck ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
}

module.exports = new CheckBoxController();
