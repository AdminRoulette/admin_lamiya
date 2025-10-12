const axios = require("axios");
const crypto = require("crypto");
const TelegramMsg = require("../TelegramMsg");
const encryptOrderNumber = require("../Order/components/encryptOrderNumber");
const privat_url = process.env.PRIVAT_PART_PAYMENT_URL;
const privat_key = process.env.NODE_ENV === "production" ? process.env.PRIVAT_PART_PAYMENT_KEY : process.env.DEV_PRIVAT_PART_PAYMENT_KEY;
const privat_store_id = process.env.NODE_ENV === "production" ? process.env.PRIVAT_STORE_ID : process.env.DEV_PRIVAT_STORE_ID;
const callback_url = process.env.NODE_ENV === "production" ? "https://lamiya.com.ua/webhook/privat-part-payments" : "https://6dc2-178-216-224-151.ngrok-free.app/webhook/privat-part-payments"

class PrivatPartPayments {

    async createOrder({orderId,privat_order_id, phone, partPaymentAmount, order_devices, totalPrice}) {
        try {
            let productsInfo = []
            for (const item of order_devices) {
                productsInfo.push({
                    name: item.product_name, count: item.count, price: item.saleprice ? item.saleprice : item.price,
                })
            }

            const requestBody = {
                storeId: privat_store_id,
                orderId: privat_order_id,
                amount: totalPrice,
                partsCount: partPaymentAmount,
                merchantType: "PP",
                products: productsInfo,
                responseUrl: callback_url,
                redirectUrl: `https://lamiya.com.ua/complete/${await encryptOrderNumber(orderId)}`, // language????????
                signature: generateSignature({
                    orderId:privat_order_id,
                    amount: totalPrice,
                    partsCount: partPaymentAmount,
                    redirectUrl: `https://lamiya.com.ua/complete/${await encryptOrderNumber(orderId)}`,
                    products: productsInfo,
                }),
                sendPhone: phone
            };
            function withoutFloatingPoint(amount) {
                return (amount.toFixed(0) * 100).toString();
            }

            function generateSignature({orderId, amount, partsCount, redirectUrl, products}) {
                const products_string = products.map(p => `${p.name}${p.count}${withoutFloatingPoint(p.price)}`).join('');
                const raw = privat_key + privat_store_id + orderId + withoutFloatingPoint(amount) + partsCount + 'PP' + callback_url + redirectUrl + products_string + privat_key;
                const sha1 = crypto.createHash('sha1').update(raw).digest();
                return sha1.toString('base64');
            }

            const {data} = await axios.post(`${privat_url}/create`, requestBody, {
                headers: {
                    "Accept": "application/json",
                    "Accept-Encoding": "UTF-8",
                    "Content-Type": "application/json; charset=UTF-8"
                }
            });

            function ResponseSignature() {
                const raw = privat_key + data.state + privat_store_id + privat_order_id + data.token + privat_key;
                const sha1 = crypto.createHash('sha1').update(raw).digest();
                return sha1.toString('base64');
            }

            if(ResponseSignature() === data.signature) {
                if(data.state === 'SUCCESS'){
                    return data;
                }else{
                    throw new Error(`state: ${data.state}. ${data?.message}`);
                }
            }else{
                throw new Error(`Відповідь не верифікована. ${data?.message}`);
            }

        } catch (error) {
            TelegramMsg("TECH", `Помилка створення оплати частинами приват. ${error?.message || error?.response.data.message}`)
            throw new Error(`Помилка створення оплати частинами приват. ${error?.message || error?.response.data.message}`);
        }
    }

    async cancel({orderId}) {
        try {
            if(!orderId){
                throw new Error(`Пустий ордер ІД ${orderId}`);
            }
            const requestBody =
                {
                    "storeId": privat_store_id,
                    "orderId": orderId,
                    "signature": generateSignature(),
                };

            function generateSignature() {
                const raw = privat_key + privat_store_id + orderId + privat_key;
                const sha1 = crypto.createHash('sha1').update(raw).digest();
                return sha1.toString('base64');
            }

            const {data} = await axios.post(`${privat_url}/cancel`, requestBody, {
                headers: {
                    "Accept": "application/json",
                    "Accept-Encoding": "UTF-8",
                    "Content-Type": "application/json; charset=UTF-8"
                }
            });

            function ResponseSignature() {
                const raw = privat_key + privat_store_id + orderId + privat_key;
                const sha1 = crypto.createHash('sha1').update(raw).digest();
                return sha1.toString('base64');
            }

            if(ResponseSignature() === data.signature) {
                if(data.state === 'SUCCESS'){
                    return data;
                }else{
                    throw new Error(`state: ${data.state}. ${data?.message}`);
                }
            }else{
                throw new Error(`Відповідь не верифікована. ${data?.message}`);
            }

        } catch (error) {
            TelegramMsg("TECH", `Помилка відміни оплати частинами приват. ${error?.message || error?.response.data.message}`)
            throw new Error(`Помилка відміни оплати частинами приват. ${error?.message || error?.response.data.message}`);
        }
    }

}

module.exports = new PrivatPartPayments;
