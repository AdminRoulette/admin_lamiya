const axios = require("axios");
const {
    Cashiers, Shops, Orders, OrderDevice, ChecksOrder, FopsList, User, CheckOrderQueue
} = require("../../models/models");
const TelegramMsg = require("../TelegramMsg");

class CheckBox {
    async createCheck({
                          amountPaid, orderId,
                          paymentMethods, order_devices, totalPrice, cashier,postMethod,source
                      }) {
        try {

            if (!(paymentMethods && paymentMethods.length > 0)) {
                throw new Error("Немає способа оплати");
            }

            if (!cashier || !cashier.shift) {
                throw new Error("Зміна закрита або касира немає");
            }


            let productList = []
            let promo_amount = 0;
            let check_payments = [];
            for (const payment of paymentMethods) {
                if (payment.type !== 'promo') {
                    check_payments.push({
                        "type": `${payment.type === 'cash' ? "CASH" : "CASHLESS"}`,
                        "value": payment.type === 'cash' && amountPaid ? +amountPaid * 100 : +payment.amount * 100,
                        code: payment.type === 'cash' ? 0 : 1,
                        label: payment.type === 'cash' ? "Готівка" : payment.type === 'terminal' ? "Картка"
                            : payment.type === 'mono' || payment.type === 'mono_part'|| payment.type === 'privat_part'
                            ? "Інтернет еквайринг" : payment.type === 'account' ? "Інтернет банкінг" : (payment.type === 'moneyback' && postMethod.startsWith('np'))
                                ? "Переказ через ННПП" : (payment.type === 'marketplace' && (source === 'rozetka' || source === 'prom')) ? "Платіж через сервіс переказу ROZETKA Pay" : "Інтернет еквайринг"
                    })
                } else {
                    promo_amount = +payment.amount;
                }
            }

            for (const OrderDevElem of order_devices) {
                if ((OrderDevElem.saleprice > 0 && OrderDevElem.price > OrderDevElem.saleprice) || promo_amount > 0) {
                    const product_price = OrderDevElem.price - OrderDevElem.saleprice;
                    let value;
                    if (promo_amount > 0) {
                        if (promo_amount > product_price * OrderDevElem.count) {
                            promo_amount -= product_price * OrderDevElem.count - OrderDevElem.count;
                            value = (product_price * OrderDevElem.count - OrderDevElem.count) * 100
                        } else {
                            value = promo_amount * 100;
                            promo_amount = 0;
                        }

                    } else {
                        value = product_price * 100 * OrderDevElem.count
                    }

                    productList.push({
                        "good": {
                            "code": `${OrderDevElem.option_id}`,
                            "name": `${OrderDevElem.product_name}`,
                            "price": OrderDevElem.price * 100
                        }, "quantity": OrderDevElem.count * 1000, "discounts": [{
                            "type": "DISCOUNT", "mode": "VALUE", "value": value, "name": "Акційна знижка"
                        }]
                    })
                } else {
                    productList.push({
                        "good": {
                            "code": `${OrderDevElem.option_id}`,
                            "name": `${OrderDevElem.product_name}`,
                            "price": OrderDevElem.price * 100
                        }, "quantity": OrderDevElem.count * 1000,
                    })
                }
            }

            const {data} = await axios.post(`${process.env.CHECKBOX_URL}receipts/sell`, {
                "goods": productList,
                "payments": check_payments,
                "total_payment": paymentMethods[0].type === 'promo' ? (totalPrice - +paymentMethods[0].amount) * 100 : totalPrice * 100,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `application/json`,
                    "X-License-Key": `${cashier.fops_list.key}`,
                    "X-Client-Name": `Integration`,
                    "Authorization": `Bearer ${cashier.bearer}`,
                }
            }).catch(error => {
                throw new Error(`Помилка створення чека! ${error?.response?.data.message} - id:${orderId}`);
            });

            await ChecksOrder.create({
                checkuuid: data?.id, orderId
            }).catch((error) => {
                console.log(error)
                TelegramMsg("TECH", `Помилка внесення чека в бд ${error?.response?.data.message}. ${data?.id}`)
            });

            // додаємо суму до каси магазину, якщо фіз продаж
            const cash = paymentMethods.find(payment => payment.type === 'cash')
            if (cash) {
                await Shops.findOne({where: {id: cashier.shop_id}}).then(shop => {
                    Shops.update({cash: shop.cash + +cash.amount}, {where: {id: cashier.shop_id}})
                }).catch((error) => {
                    TelegramMsg("TECH", `Помилка внесення готівки в магазин ${error?.response?.data.message}.`)
                });
            }

            // додаємо суму до фопа
            await FopsList.findOne({where: {id: cashier.fops_list.id}}).then(async fop => {
                await FopsList.update({total_sell: fop.total_sell + totalPrice}, {where: {id: cashier.fops_list.id}}).catch((error) => {
                    TelegramMsg("TECH", `Помилка додавання суми до фопа #2 ${error?.response?.data.message}. Сума: +${totalPrice}`)
                });
            }).catch((error) => {
                TelegramMsg("TECH", `Помилка пошука фопа #1 ${error?.response?.data.message}. Сума: +${totalPrice}`)
            });
            return data?.id

        } catch (error) {
            TelegramMsg("TECH", `CheckBox: createCheck. ${error?.message} - id:${orderId}`)
            return null;
        }
    }

    async getNewCashierBearer(LicenseKey, pinCode) {
        try {
            const {data} = await axios.post(`${process.env.CHECKBOX_URL}cashier/signinPinCode`, {
                "pin_code": pinCode
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `application/json`,
                    "X-License-Key": `${LicenseKey}`,
                    "X-Client-Name": `Integration`,
                },
            })
            return data.access_token;
        } catch (error) {
            TelegramMsg("TECH", `CheckBox: Помилка інформації про зміну. ${error?.response.data.message}`)
            throw new Error(`Помилка інформації про зміну. ${error?.response.data.message}`);
        }
    }

    async cashRegisterInfo(LicenseKey) {
        try {
            const {data} = await axios.get(`${process.env.CHECKBOX_URL}cash-registers/info`, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `application/json`,
                    "X-License-Key": `${LicenseKey}`,
                    "X-Client-Name": `Integration`,
                },
            })
            return data;
        } catch (error) {
            TelegramMsg("TECH", `CheckBox: Помилка інформації про зміну. ${error?.response.data.message}`)
            throw new Error(`Помилка інформації про зміну. ${error?.response.data.message}`);
        }
    }

    async statusShifts(LicenseKey, Bearer) {
        try {
            const {data} = await axios.get(`${process.env.CHECKBOX_URL}shifts?desc=true&limit=1`, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `application/json`,
                    "X-License-Key": `${LicenseKey}`,
                    "X-Client-Name": `Integration`,
                    "Authorization": `Bearer ${Bearer}`,
                },
            })
            return data;
        } catch (error) {
            TelegramMsg("TECH", `CheckBox: Помилка статуса зміни ${error?.response.data.message}`)
            throw new Error(`Помилка статуса зміни. ${error?.response.data.message}`);
        }
    }

    async report(LicenseKey, Bearer) {
        try {
            const {data} = await axios.post(`${process.env.CHECKBOX_URL}reports`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `application/json`,
                    "X-License-Key": `${LicenseKey}`,
                    "X-Client-Name": `Integration`,
                    "Authorization": `Bearer ${Bearer}`,
                },
            })
            return data;
        } catch (error) {
            TelegramMsg("TECH", `CheckBox: Помилка Х звіту ${error?.response.data.message}`)
            throw new Error(`Помилка Х звіту. ${error?.response.data.message}`)
        }
    }

    async shift(LicenseKey, Bearer) {
        try {
            const {data} = await axios.post(`${process.env.CHECKBOX_URL}shifts`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `application/json`,
                    "X-License-Key": `${LicenseKey}`,
                    "X-Client-Name": `Integration`,
                    "Authorization": `Bearer ${Bearer}`,
                },
            })
            return data;
        } catch (error) {
            TelegramMsg("TECH", `Checkbox: Помилка відкриття зміни ${error?.response.data.message}`)
            throw new Error(`Помилка відкриття зміни. ${error?.response.data.message}`);
        }
    }

    async getOfflineCodesCount(LicenseKey, Bearer) {
        try {
            const {data} = await axios.get(`${process.env.CHECKBOX_URL}cash-registers/get-offline-codes-count`, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `application/json`,
                    "X-License-Key": `${LicenseKey}`,
                    "X-Client-Name": `Integration`,
                    "Authorization": `Bearer ${Bearer}`,
                },
            })
            return data;
        } catch (error) {
            TelegramMsg("TECH", `Checkbox: Помилка отримання офлайн кодів ${error?.response.data.message}`)
            throw new Error(`Помилка отримання офлайн кодів. ${error?.response.data.message}`);
        }
    }

    async getNewOfflineCodes(LicenseKey, Bearer) {
        try {
            await axios.get(`${process.env.CHECKBOX_URL}cash-registers/ask-offline-codes?count=2000&sync=false`, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `*/*`,
                    "X-License-Key": `${LicenseKey}`,
                    "X-Client-Name": `Integration`,
                    "Authorization": `Bearer ${Bearer}`,
                },
            })
        } catch (error) {
            TelegramMsg("TECH", `Checkbox: Помилка створення нових кодів: ${error?.response.data.message}`)
            throw new Error(`Помилка створення нових кодів. ${error?.response.data.message}`);
        }
    }

    async closeShift(LicenseKey, Bearer) {
        try {
            const {data} = await axios.post(`${process.env.CHECKBOX_URL}shifts/close`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `application/json`,
                    "X-License-Key": `${LicenseKey}`,
                    "X-Client-Name": `Integration`,
                    "Authorization": `Bearer ${Bearer}`,
                },
            })
            return data;
        } catch (error) {
            TelegramMsg("TECH", `Checkbox: Помилка закриття зміни: ${error?.response.data.message}`)
            throw new Error(`Помилка закриття зміни. ${error?.response.data.message}`);
        }
    }

    async serviceCash(money, LicenseKey, Bearer) {
        try {
            const {data} = await axios.post(`${process.env.CHECKBOX_URL}receipts/service`, {
                "payment": {
                    "type": "CASH", "value": Number(money), "label": "Готівка"
                }
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `application/json`,
                    "X-License-Key": `${LicenseKey}`,
                    "X-Client-Name": `Integration`,
                    "Authorization": `Bearer ${Bearer}`,
                },
            })
            return data;
        } catch (error) {
            console.log(error)
            TelegramMsg("TECH", `Checkbox: Помилка службового внесення: ${error?.response?.data.message}`)
            throw new Error(`Помилка службового внесення. ${error?.response?.data.message}`);
        }
    }

    async CheckInfo({id, LicenseKey, Bearer}) {
        try {
            const {data} = await axios.get(`${process.env.CHECKBOX_URL}receipts/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `application/json`,
                    "X-License-Key": `${LicenseKey}`,
                    "X-Client-Name": `Integration`,
                    "Authorization": `Bearer ${Bearer}`,
                },
            })
            return data;
        } catch (error) {
            TelegramMsg("TECH", `Checkbox: Помилка отримання інформації про чек: ${error?.response.data.message}`)
            throw new Error(`Помилка отримання інформації про чек. ${error?.response.data.message}`);
        }
    }

    async cancelCheck(checkInfo, LicenseKey, Bearer) {
        try {
            let goods = [];
            let payments = []
            for (const good of checkInfo.goods) {
                goods.push({...good, is_return: true})
            }

            if (checkInfo.total_sum === checkInfo.total_payment) {
                payments = checkInfo.payments;
            } else {
                // таке може бути коли 1 пеймент, кеш з рештою
                payments = [{...checkInfo.payments[0], value: checkInfo.total_sum}];
            }

            const {data} = await axios.post(`${process.env.CHECKBOX_URL}receipts/sell`, {
                "goods": goods, "payments": payments, related_receipt_id: checkInfo.id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "accept": `application/json`,
                    "X-License-Key": `${LicenseKey}`,
                    "X-Client-Name": `Integration`,
                    "Authorization": `Bearer ${Bearer}`,
                },
            })

            return data.id;

        } catch (error) {
            TelegramMsg("TECH", `Checkbox: Помилка відміни чека: ${error?.response.data.message}`)
            throw new Error(`Помилка відміни чека. ${error?.response.data.message}`);
        }
    }

}

module.exports = new CheckBox;
