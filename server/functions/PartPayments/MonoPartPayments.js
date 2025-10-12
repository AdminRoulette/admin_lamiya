const crypto = require("crypto");
const axios = require("axios");
const apiError = require("../../error/apierror");
const TelegramMsg = require("../TelegramMsg");
const mono_url = process.env.NODE_ENV === "production" ? process.env.MONO_PART_PAYMENT_URL : process.env.DEV_PART_PAYMENT_URL;
const mono_key = process.env.NODE_ENV === "production" ? process.env.MONO_PART_PAYMENT_KEY : process.env.DEV_PART_PAYMENT_KEY;
const mono_store = process.env.NODE_ENV === "production" ? process.env.MONO_STORE_ID : process.env.DEV_STORE_ID;
const callback_url = process.env.NODE_ENV === "production" ? "https://lamiya.com.ua/webhook/mono-part-payments" :"https://7bb8-178-216-224-2.ngrok-free.app/webhook/mono-part-payments"
class MonoPartPayments {

    async createOrder({orderId,phone,partPaymentAmount,order_devices,totalPrice,shopId=null}) {
        try {
            let productsInfo = []
            for(const item of order_devices){
                productsInfo.push({
                    name: item.product_name,
                    count: item.count,
                    sum: item.saleprice ? item.saleprice.toFixed(2) : item.price.toFixed(2),
                })
            }

            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            const requestBody = {
                store_order_id: orderId,
                client_phone: phone,
                total_sum: totalPrice.toFixed(2),
                invoice: {
                    date: formattedDate,
                    number: orderId,
                    point_id: shopId?`store#${shopId}`:undefined,
                    source: shopId?"STORE":"INTERNET"
                },
                available_programs: [
                    {
                        available_parts_count: [partPaymentAmount],
                        type: "payment_installments"
                    }
                ],
                products: productsInfo,
                result_callback: callback_url,
            };

            function signRequest() {
                const hmac = crypto.createHmac('sha256', Buffer.from(mono_key, 'utf-8'));
                hmac.update(JSON.stringify(requestBody), 'utf8');
                return hmac.digest('base64');
            }

            const signature = signRequest();
            const {data} = await axios.post(`${mono_url}/api/order/create`, requestBody, {
                headers: {
                    "signature": signature,
                    "store-id": mono_store
                }
            });
            return data;
        } catch (error) {
            TelegramMsg("TECH", `Помилка створення оплати частинами моно. ${error?.response.data.message}`)
            throw new Error(`Помилка створення оплати частинами. ${error?.response.data.message}`);
        }
    }

    async checkOrderState({order_id}) {
        try {
            const requestBody = {order_id};

            function signRequest() {
                const hmac = crypto.createHmac('sha256', Buffer.from(mono_key, 'utf-8'));
                hmac.update(JSON.stringify(requestBody), 'utf8');
                return hmac.digest('base64');
            }

            const signature = signRequest();

            const {data} = await axios.post(`${mono_url}/api/order/state`, requestBody, {
                headers: {
                    "signature": signature,
                    "store-id": mono_store
                }
            });
            return data;

        } catch (error) {
            TelegramMsg("TECH", `Помилка отримання статусу оплати частинами моно. ${error?.response.data.message}`)
            throw new Error(`Помилка статусу оплати частинами. ${error?.response.data.message}`);
        }
    }

    async getOrdersReportByDate({date}) {
        try {
            const requestBody = {date};

            function signRequest() {
                const hmac = crypto.createHmac('sha256', Buffer.from(mono_key, 'utf-8'));
                hmac.update(JSON.stringify(requestBody), 'utf8');
                return hmac.digest('base64');
            }

            const signature = signRequest();

            const {data} = await axios.post(`${mono_url}/api/store/report`, requestBody, {
                headers: {
                    "signature": signature,
                    "store-id": mono_store
                }
            });
            return data;

        } catch (error) {
            TelegramMsg("TECH", `Помилка отримання звіту по оплатам частинами моно. ${error?.response.data.message}`)
            throw new Error(`Помилка отримання звіту по оплатам частинами. ${error?.response.data.message}`);
        }
    }

    async confirmSendOrderToUser({order_id}) {
        try {
            const requestBody = {order_id};

            function signRequest() {
                const hmac = crypto.createHmac('sha256', Buffer.from(mono_key, 'utf-8'));
                hmac.update(JSON.stringify(requestBody), 'utf8');
                return hmac.digest('base64');
            }

            const signature = signRequest();

            const {data} = await axios.post(`${mono_url}/api/order/confirm`, requestBody, {
                headers: {
                    "signature": signature,
                    "store-id": mono_store
                }
            });
            return data;
        } catch (error) {
            TelegramMsg("TECH", `Помилка підтвердження видачі товару оплати частинами моно. ${error?.response.data.message}`)
            throw new Error(`Помилка підтвердження видачі товару оплати частинами. ${error?.response.data.message}`);
        }
    }

    async checkOrderPaid({order_id}) {
        try {
            const requestBody = {order_id};

            function signRequest() {
                const hmac = crypto.createHmac('sha256', Buffer.from(mono_key, 'utf-8'));
                hmac.update(JSON.stringify(requestBody), 'utf8');
                return hmac.digest('base64');
            }

            const signature = signRequest();

            const {data} = await axios.post(`${mono_url}/api/order/check/paid`, requestBody, {
                headers: {
                    "signature": signature,
                    "store-id": mono_store
                }
            });
            return data;
        } catch (error) {
            TelegramMsg("TECH", `Помилка підтвердження видачі товару оплати частинами моно. ${error?.response.data.message}`)
            throw new Error(`Помилка підтвердження видачі товару оплати частинами. ${error?.response.data.message}`);
        }
    }

    async returnOrder({order_id}) {
        //Повернення товару за заявкою (повне або часткове)
        try {
            const requestBody = {order_id,
                return_money_to_card: true, //Ознака необхідності повернення грошей на картку клієнта. TRUE — банк повинен повернути гроші на картку клієнта, FALSE — магазин сам повернув готівку клієнтові
                store_return_id:"test2",
                sum:1500.00};

            function signRequest() {
                const hmac = crypto.createHmac('sha256', Buffer.from(mono_key, 'utf-8'));
                hmac.update(JSON.stringify(requestBody), 'utf8');
                return hmac.digest('base64');
            }

            const signature = signRequest();

            const {data} = await axios.post(`${mono_url}/api/order/return`, requestBody, {
                headers: {
                    "signature": signature,
                    "store-id": mono_store
                }
            });
            return data;
        } catch (error) {
            TelegramMsg("TECH", `Помилка відміни оплати частинами моно. ${error?.response.data.message}`)
            throw new Error(`Помилка відміни оплати частинами. ${error?.response.data.message}`);
        }
    }

    async rejectOrder({order_id}) {
        //Скасування заявки (Товар клієнтові не видано)
        try {
            const requestBody = {order_id};

            function signRequest() {
                const hmac = crypto.createHmac('sha256', Buffer.from(mono_key, 'utf-8'));
                hmac.update(JSON.stringify(requestBody), 'utf8');
                return hmac.digest('base64');
            }

            const signature = signRequest();

            const {data} = await axios.post(`${mono_url}/api/order/reject`, requestBody, {
                headers: {
                    "signature": signature,
                    "store-id": mono_store
                }
            });
            return data;
        } catch (error) {
            TelegramMsg("TECH", `Помилка відміни оплати частинами моно. ${error?.response.data.message}`)
            throw new Error(`Помилка відміни оплати частинами. ${error?.response.data.message}`);
        }
    }

    async checkFinancePhone({phone}) {
        try {
            const requestBody = {phone};

            function signRequest() {
                const hmac = crypto.createHmac('sha256', Buffer.from(mono_key, 'utf-8'));
                hmac.update(JSON.stringify(requestBody), 'utf8');
                return hmac.digest('base64');
            }

            const signature = signRequest();

            const {data} = await axios.post(`${mono_url}/api/v2/client/validate`, requestBody, {
                headers: {
                    "signature": signature,
                    "store-id": mono_store
                }
            });
            return data;

        } catch (error) {
            TelegramMsg("TECH", `Помилка перевірки номера оплати частинами моно. ${error?.response.data.message}`)
            throw new Error(`Помилка перевірки номера оплати частинами моно`);
        }
    }
}

module.exports = new MonoPartPayments;
