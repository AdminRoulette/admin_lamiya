const axios = require("axios");
const {PaymentOrder} = require("../../../../models/models");

async function MerchantInvoice({totalPrice, deviceBasket, orderId, reNew}) {
    const data = await axios.post(`${process.env.MONO_API_URL}invoice/create`, {
        "amount": totalPrice * 100,
        "ccy": 980,
        "merchantPaymInfo": {
            "reference": `${orderId}`,
            "destination": `Оплата замовлення №${orderId}`,
            "basketOrder": deviceBasket.map((basketElem) => {
                return ({
                    "name": basketElem.name,
                    "qty": basketElem.count,
                    "sum": basketElem.saleprice > 0 ? basketElem.saleprice * 100 : basketElem.price * 100,
                    "icon": basketElem.img,
                    "unit": "шт.",
                })
            })
        },
        "redirectUrl": `${process.env.NODE_ENV === "production" ? "https://lamiya.com.ua/complete/" : "http://localhost:3000/complete/"}${orderId}`,
        "webHookUrl": `${process.env.NODE_ENV === "production" ? "https://lamiya.com.ua/webhook/mono" : "https://lamiya.com.ua/webhook/mono"}`,
        "validity": 3600,
        "paymentType": "debit",
    }, {
        headers: {
            "X-Token": `${process.env.NODE_ENV === "production" ? process.env.MONO_API_KEY : process.env.MONO_API_KEY_DEV}`
        },
    }).catch( async error =>{
        if (reNew) {
            PaymentOrder.update({status: 'failure', link: null, orderId}, {where: {orderId}})
        } else {
            PaymentOrder.create({status: 'failure', link: null, orderId})
        }
    })
    if (data?.data) {
        if (reNew) {
            PaymentOrder.update({
                invoiceId: data.data.invoiceId, link: data.data.pageUrl, lastInvoiceUpdate: Date.now()
            }, {where: {orderId}});

        } else {
            PaymentOrder.create({
                invoiceId: data.data.invoiceId, orderId, link: data.data.pageUrl, lastInvoiceUpdate: Date.now()
            });
        }
        return data.data.pageUrl
    }
}


module.exports = MerchantInvoice;
