const axios = require("axios");
const apiError = require("../error/apierror");
const {
    OrderDevice,
    DeviceOptions,
    Device,
    Brand,
    DeviceImage,
    Orders,
    PaymentOrder,
    FopsList
} = require("../models/models");
const MerchantInvoice = require("../functions/Order/CreateOrder/Components/MerchantInvoice");
const TelegramMsg = require("../functions/TelegramMsg");
const crypto = require("crypto");
const MonoPartPayments = require("../functions/PartPayments/MonoPartPayments");

class monoController {

    async CheckPhone(req, res, next) {
        const {phone, language} = req.body;
        try {
            const PHONE_REGEXP = /^[+38]{3}[0-9]{10}$/;
            if (!phone || !phone.match(PHONE_REGEXP)) {
                return next(apiError.badRequest(language ? "Неправильный формат номера" : "Невірний формат номера"));
            }

            const data = await MonoPartPayments.checkFinancePhone({phone})
            return res.json(data);
        } catch (err) {
            TelegramMsg("TECH", `CheckPhone ${err?.message}`)
            next(apiError.badRequest(language ? "Ошибка при проверке номера" : "Помилка при перевірці номера"));
        }
    }

    async getFopPayments(req, res, next) {
        try {
            const {id} = req.query;

            const fop = await FopsList.findOne(
                {
                    where: {id}
                }
            );
            let now = new Date()
            let oldDate = Math.floor(now.setDate(now.getDate() - 29) / 1000)
            await axios.get(`${process.env.MONO_PAYMENT_URL}${fop.mono_account_key}/${oldDate}`, {
                headers: {
                    "X-Token": fop.mono_fop_key
                },
            }).then(async (PaymentList) => {
                let Balance = PaymentList.data[0].balance / 100
                let Array = [];
                for (const payment of PaymentList.data) {
                    Array.push({
                        amount: payment.amount / 100,
                        comment: payment.comment,
                        counterName: payment.counterName,
                        time: payment.time
                    })
                }
                return res.json([Array, Balance]);
            })
        } catch (e) {
            TelegramMsg("TECH", `getFopPayments ${e.message}`)
            next(apiError.badRequest("Помилка під час отримання даних про оплати"));
        }
    }
}

module.exports = new monoController();