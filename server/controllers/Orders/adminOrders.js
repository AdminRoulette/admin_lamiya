const {
    Orders,
    OrderDevice,
    DeviceOptions,
    Device,
    Brand,
    User,
    BasketDevice,
    ParfumePart,
    PaymentOrder,
    DeliveryOrder,
    ChecksOrder,
    Cashiers,
    FopsList,
    UserStats
} = require("../../models/models");
const CalculatePromoAndNoSalePrice = require("../../functions/Order/components/CalculatePromoAndNoSalePrice");
const CalculateProductCount = require("../../functions/Order/components/CalculateProductCount");
const CalculateTotalPrice = require("../../functions/Order/CreateOrder/Components/CalculateTotalPrice");
const apiError = require("../../error/apierror");
const RecipientAndTTN = require("../../functions/Order/CreateOrder/Components/RecipientAndTTN");
const CheckBox = require("../../functions/CheckBox/CheckBox");
const TelegramMsg = require("../../functions/TelegramMsg");
const axios = require("axios");
const UpdateStock = require("../../functions/Product/UpdateStock");
const MonoPartPayments = require("../../functions/PartPayments/MonoPartPayments");
const PrivatPartPayments = require("../../functions/PartPayments/PrivatPartPayments");

class adminOrders {

    async CreateOrder(req, res, next) {
        try {

            const basketDevice = await BasketDevice.findAll({
                where: {userId: req.user.id}, include: [{
                    model: DeviceOptions, include: [{
                        model: Device
                    }]
                }]
            });

            let totalProfit = 0;
            let totalPrice = 0;

            if (basketDevice.length === 0) {
                return next(apiError.PreconditionFailed("Кошик пустий"))
            }

            if (!req.user.role?.includes("ADMIN") && basketDevice.every(item => (item.deviceoption.count > item.count && item.deviceoption.sell_type === "on_tab" && !item.deviceoption.sell_type === "preorder"))) {
                return next(apiError.PreconditionFailed("Товару немає в наявності"))
            }

            let orderDeviceBulk = [];
            let productIds = [];

            await Orders.create({userId: req.user.id}).then(async (order) => {
                const {id} = order.get();
                for (const basketItem of basketDevice) {
                    const OptionElem = basketItem.deviceoption;
                    const count = basketItem.count;
                    await CalculateTotalPrice({promo: "", OptionElem, count}).then((calcTotalPriceRes) => {
                        totalProfit += calcTotalPriceRes.totalProfit;
                        totalPrice += calcTotalPriceRes.totalPrice;
                    });
                    productIds.push(await CalculateProductCount({
                        oldOptionElem: OptionElem, count, orderId: id, userId: req.user.id
                    }));

                    orderDeviceBulk.push({
                        order_id: id,
                        option_id: OptionElem.id,
                        count: count,
                        price: OptionElem.price,
                        saleprice: OptionElem.saleprice,
                        product_name: `${OptionElem.device.name} ${OptionElem.optionName}`,
                        product_name_ru: `${OptionElem.device.name_ru} ${OptionElem.optionName_ru}`,
                        series: OptionElem.device.series,
                        series_ru: OptionElem.device.series_ru,
                        special_type: OptionElem.sell_type
                    })
                }
                await OrderDevice.bulkCreate(orderDeviceBulk);
                UpdateStock(productIds)
                await DeliveryOrder.create({orderId: id})
                await PaymentOrder.create({orderId: id});
                await Orders.update({
                    totalPrice: totalPrice,
                    totalProfit: totalProfit,
                    moneyCard: totalPrice,
                }, {where: {id}})
            });
            await BasketDevice.destroy({where: {userId: req.user.id}})
            return res.json('done')
        } catch (e) {
            TelegramMsg("TECH", `CreateOrder ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async CompleteRealOrder(req, res, next) {
        const {
            postMethod, orderId, moneyLose, promoCode, payments, finance_phone, partPaymentAmount, amountPaid
        } = req.body;

        try {
            const isPartPayment = payments.some(p => (p.type === 'mono_part' || p.type === 'privat_part'))
            let payment_status = 'paid'
            let MerchantPercent = 0;
            await Orders.findOne({
                where: {id: orderId}, include: [{
                    model: OrderDevice
                }, {
                    model: FopsList
                }]
            }).then(async (OrderElem) => {
                if (!(OrderElem.status_id === 'in_store' || OrderElem.status_id === 'new')) {
                    return next(apiError.badRequest('Замовлення вже оброблено, оновіть сторінку'));
                }
                let totalProfit = OrderElem.totalProfit;
                let totalPrice = OrderElem.totalPrice;
                if (promoCode) {
                    //тут промокод треба отримати?

                    // CalculatePromoAndNoSalePrice({
                    //     promoCode, totalProfit, totalPrice, OrderElem
                    // }).then((result) => {
                    //     totalProfit = result.totalProfit;
                    //     totalPrice = result.totalPrice;
                    // })
                }
                const cashier = await Cashiers.findOne({
                    include: [{
                        model: FopsList
                    }], where: {userId: req.user.id, shift: true}
                }).catch((error) => {
                    throw new Error(`Помилка касира ${error.message}`);
                })
                let checkuuid;
                checkuuid = await CheckBox.createCheck({
                    amountPaid,
                    orderId,
                    cashier: cashier,
                    paymentMethods: payments,
                    order_devices: OrderElem.order_devices,
                    totalPrice,
                    postMethod
                })

                if (!checkuuid) return next(apiError.PreconditionFailed("Помилка створення чека, повторіть пізніше"))


                if (payments[0].type === 'mono_part') {
                    await MonoPartPayments.createOrder({
                        orderId,
                        phone: finance_phone,
                        partPaymentAmount,
                        order_devices: OrderElem.order_devices,
                        totalPrice
                    }).then(res => {
                        PaymentOrder.update({
                            invoiceId: res.order_id, status: "processing", lastInvoiceUpdate: Date.now()
                        }, {where: {orderId}});
                        payment_status = "processing"
                    }).catch(error => {
                        PaymentOrder.update({
                            status: "failure", sub_status:"bank_error", lastInvoiceUpdate: Date.now()
                        }, {where: {orderId}});
                        payment_status = "failure"
                    })
                    MerchantPercent = Math.ceil(totalPrice * (partPaymentAmount === 3 ? 0.029 : 0.041)); //3 або 4 платежі
                } else if (payments[0].type === 'privat_part') {
                    const privat_order_id = `lamiya-${new Date().getTime()}`;
                    await PrivatPartPayments.createOrder({
                        orderId: orderId,
                        privat_order_id: privat_order_id,
                        phone: finance_phone,
                        partPaymentAmount,
                        order_devices: OrderElem.order_devices,
                        totalPrice
                    }).then(res => {
                        PaymentOrder.update({
                            invoiceId: privat_order_id,
                            status: "processing",
                            lastInvoiceUpdate: Date.now(),
                            link: `https://payparts2.privatbank.ua/ipp/v2/payment?token=${res.token}`
                        }, {where: {orderId}});
                        payment_status = "processing"
                    }).catch(error => {
                        TelegramMsg("TECH", `Помилка створення оплати частинами приват. ${JSON.stringify(res)}`)
                        PaymentOrder.update({
                            invoiceId: privat_order_id, sub_status:"bank_error", status: "failure", lastInvoiceUpdate: Date.now()
                        }, {where: {orderId}});
                        payment_status = "failure"
                    })
                    MerchantPercent = Math.ceil(totalPrice * (partPaymentAmount === 2 ? 0.028 : partPaymentAmount === 3 ? 0.03 : 0.041)); // 2,3,4 платежі + 1.3% еквайрінг
                } else {
                    PaymentOrder.update({status: 'paid'}, {where: {orderId}});
                    payment_status = "paid"
                    if (payments[0].type === 'terminal') {
                        MerchantPercent = Math.ceil(totalPrice * 0.016);
                    }
                }
                let moneyCard = totalPrice;

                DeliveryOrder.update({
                    deliveryPay: 'sender',
                    full_delivery_address: "Магазин Lamiya в м.Вільногірськ, вул. Центральна 55",
                    full_delivery_address_ru: "Магазин Lamiya в г.Вольногорск, ул. Центральная 55"
                }, {where: {orderId}})

                const objData = {
                    status_id: isPartPayment ? 'packing' : 'completed',
                    totalPrice: totalPrice,
                    totalProfit: totalProfit - moneyLose - MerchantPercent,
                    postMethod,
                    moneyLose: moneyLose,
                    paymentMethods: payments,
                    promo: promoCode,
                    moneyCard: moneyCard - moneyLose - MerchantPercent,
                    source: OrderElem.source,
                    fop_id: isPartPayment ? 1 : cashier.fop_id
                };

                await Orders.update(objData, {where: {id: orderId}})

                return res.json({
                    ...objData,
                    payment_status: payment_status,
                    fop: cashier.fops_list.name,
                    status: isPartPayment ? "Комплектується" : "Замовлення виконано",
                    payment_type: payments.length === 1 ? payments[0].type : "combo",
                    address: "Магазин Lamiya в м.Вільногірськ, вул. Центральна 55",
                    ...(checkuuid && {checkuuid_list: [{checkuuid: checkuuid, return: false}]})
                })
            });
        } catch (error) {
            console.log(error)
            TelegramMsg("TECH", `completeOrder ${error?.message}`)
            next(apiError.badRequest(error?.message));
        }
    }

    async completeOrder(req, res, next) {
        const {
            postMethod,
            orderId,
            moneyLose,
            promoCode,
            firstName,
            lastName,
            mobile,
            warehouseRef,
            deliveryPay,
            moneyBack,
            payments,
            cityRef,
            ttn,
            source,
            partPaymentAmount,
            partPaymentPhone,
            fop_id,
            streetRef,
            apartment,
            house
        } = req.body;

        try {
            async function UpdateOrder(obj, returnObj) {
                await Orders.update(obj, {where: {id: orderId}});
                return {...obj, ...returnObj}
            }
            let payment_status = 'paid';
            let weight = 0;
            let MerchantPercent = 0;

            await Orders.findOne({
                where: {id: orderId}, include: [{
                    model: OrderDevice, include: [{
                        model: DeviceOptions, include: [{
                            model: Device, include: [{model: Brand}]
                        }]
                    }]
                }, {model: User}]
            }).then(async (OrderElem) => {
                if (OrderElem.status_id !== 'new') {
                    return next(apiError.badRequest('Замовлення вже створене'));
                }
                for (const orderDevElem of OrderElem.order_devices) {
                    weight += orderDevElem.deviceoption.weight;
                }
                let totalProfit = OrderElem.totalProfit;
                let totalPrice = OrderElem.totalPrice;
                if (promoCode) {
                    CalculatePromoAndNoSalePrice({
                        promoCode, totalProfit, totalPrice, OrderElem
                    }).then((result) => {
                        totalProfit = result.totalProfit;
                        totalPrice = result.totalPrice;
                    })
                }

                if (payments.some(p => p.type === 'marketplace')) {
                        MerchantPercent = Math.ceil(totalPrice * 0.016);
                    PaymentOrder.update({
                        invoiceId: res.order_id, status: "paid", lastInvoiceUpdate: Date.now()
                    }, {where: {orderId}})
                    payment_status = "paid"
                } else if (payments.some(p => p.type === 'mono_part')) {
                    await MonoPartPayments.createOrder({
                        orderId,
                        phone: partPaymentPhone,
                        partPaymentAmount,
                        order_devices: OrderElem.order_devices,
                        totalPrice
                    }).then(res => {
                        PaymentOrder.update({
                            invoiceId: res.order_id, status: "processing", lastInvoiceUpdate: Date.now()
                        }, {where: {orderId}})
                        payment_status = "processing"
                    }).catch(error => {
                        PaymentOrder.update({
                            status: "failure", lastInvoiceUpdate: Date.now()
                        }, {where: {orderId}});
                        payment_status = "failure"
                    })
                    MerchantPercent = Math.ceil(totalPrice * (partPaymentAmount === 3 ? 0.029 : 0.041));
                } else if (payments.some(p => p.type === 'privat_part')) {
                    const privat_order_id = `lamiya-${new Date().getTime()}`;
                    await PrivatPartPayments.createOrder({
                        orderId: orderId,
                        privat_order_id: privat_order_id,
                        phone: partPaymentPhone,
                        partPaymentAmount,
                        order_devices: OrderElem.order_devices,
                        totalPrice
                    }).then(res => {
                        PaymentOrder.update({
                            invoiceId: privat_order_id,
                            status: "processing",
                            lastInvoiceUpdate: Date.now(),
                            link: `https://payparts2.privatbank.ua/ipp/v2/payment?token=${res.token}`
                        }, {where: {orderId}});
                        payment_status = "processing"
                    }).catch(error => {
                        // Тут варто писати текст помилки в Sub_state?
                        TelegramMsg("TECH", `Помилка створення оплати частинами приват. ${JSON.stringify(res)}`)
                        PaymentOrder.update({
                            invoiceId: privat_order_id, status: "failure", lastInvoiceUpdate: Date.now()
                        }, {where: {orderId}});
                        payment_status = "failure"
                    })
                    MerchantPercent = Math.ceil(totalPrice * (partPaymentAmount === 2 ? 0.028 : partPaymentAmount === 3 ? 0.03 : 0.041)); // 2,3,4 платежі + 1.3% еквайрінг
                }else if (payments.some(p => p.type === 'moneyback')) {
                    MerchantPercent = Math.ceil(totalPrice * 0.016);
                    PaymentOrder.update({
                        invoiceId: res.order_id, status: "moneyback", lastInvoiceUpdate: Date.now()
                    }, {where: {orderId}})
                    payment_status = "moneyback"
                }else if (payments.some(p => p.type === 'account')) {
                    PaymentOrder.update({
                        invoiceId: res.order_id, status: "not_paid", lastInvoiceUpdate: Date.now()
                    }, {where: {orderId}})
                    payment_status = "not_paid"
                }
                let moneyCard = totalPrice;

                const fop = await FopsList.findOne({where: {id: fop_id}})

                if (lastName.length > 1 && firstName.length > 1 &&
                    ((postMethod.startsWith('ukr') && cityRef && warehouseRef)
                        || (postMethod.startsWith("np") &&
                            ((cityRef && warehouseRef) || (cityRef && streetRef && apartment && house))))) {
                    const deliveryData = await RecipientAndTTN({
                        firstName,
                        lastName,
                        mobile,
                        postMethod,
                        warehouseRef,
                        deliveryPay,
                        weight,
                        totalPrice,
                        moneyBack,
                        cityRef,
                        ttn,
                        fop: fop,
                        streetRef,
                        apartment,
                        house,
                        orderId
                    }).catch(error => {
                        return next(apiError.badRequest(`Помилка створення ТТН ${error.message}`));
                    })

                    const user_stats = await UserStats.findOne({where: {phone: mobile}});
                    if (user_stats) {
                        await UserStats.update({
                            completed_orders: user_stats.completed_orders + 1,
                            completed_percent: Number((((user_stats.completed_orders + 1) / (user_stats.total_orders + 1)) * 100).toFixed(2)),
                            total_orders: user_stats.total_orders + 1,
                        }, {where: {id: user_stats.id}});
                    } else {
                        await UserStats.create({phone: mobile});
                    }

                    return res.json(await UpdateOrder({
                        fop_id,
                        status_id: 'created',
                        totalPrice: totalPrice,
                        totalProfit: Math.floor(totalProfit - moneyLose - (deliveryPay === 'sender' ? deliveryData.deliveryPrice : 0) - MerchantPercent),
                        moneyCard: Math.floor(moneyCard - moneyLose - (deliveryPay === 'sender' ? deliveryData.deliveryPrice : 0) - MerchantPercent),
                        postMethod,
                        moneyLose,
                        paymentMethods: payments,
                        promo: promoCode,
                        source
                    }, {
                        status:"Створене замовлення",
                        payment_status,
                        fop: fop.name,
                        firstName: firstName,
                        lastName: lastName,
                        mobile: mobile,
                        ttn: deliveryData.ttn,
                    }))
                }
            });
        } catch (error) {
            TelegramMsg("TECH", `completeOrder ${error.message}`)
            next(apiError.badRequest(error.message));
        }
    }

    async ChangePrivacyComment(req, res, next) {
        const {orderId, comment} = req.body;
        try {
            if (comment.length > 254 || !(typeof comment === "string")) {
                return next(apiError.badRequest('Коментар занадто довгий'));
            }

            await Orders.update({privacy_comment: comment}, {where: {id: orderId}});

            return res.json("done")

        } catch (e) {
            TelegramMsg("TECH", `ChangePrivacyComment ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async PackingStatus(req, res, next) {
        const {orderId} = req.body;
        try {
            let cashier = {};
            let checkuuid;
            const order = await Orders.findOne({
                where: {id: orderId}, include: [{
                    model: OrderDevice
                }, {
                    model: FopsList
                }]
            }).catch((error) => {
                throw new Error(`Помилка в замовленні, оновіть сторінку: ${orderId}`);
            });

            if (!(order.status_id === 'ready-delivery' || order.status_id === 'created')) {
                return next(apiError.PreconditionFailed("Замовлення в невірному статусі, оновіть сторінку"))
            }
            if (order.status_id === 'created') {
                cashier = await Cashiers.findOne({
                    where: {userId: req.user.id, shift: true}, include: [{
                        model: FopsList
                    }]
                }).catch((error) => {
                    throw new Error(`Помилка касира ${error.message}`);
                });

                if (!cashier || cashier.fop_id !== order.fops_list.id) {
                    cashier = await Cashiers.findOne({
                        where: {fop_id: order.fops_list.id, shift: true}, include: [{
                            model: FopsList
                        }]
                    }).catch((error) => {
                        throw new Error(`Помилка касира #2 ${error.message}`);
                    })
                }


                checkuuid = await CheckBox.createCheck({
                    orderId,
                    paymentMethods: order.paymentMethods,
                    order_devices: order.order_devices,
                    totalPrice: order.totalPrice,
                    cashier: cashier,
                    source: order.source,
                    postMethod: order.postMethod
                })

                if (!checkuuid) return next(apiError.PreconditionFailed("Помилка створення чека, повторіть пізніше"))

            }
            await Orders.update({status_id: 'packing'}, {where: {id: orderId}});

            return res.json({
                status: 'Комплектується', status_id: 'packing',
                ...(checkuuid && {
                    checkuuid_list: [{checkuuid, return: false}]
                })
            })

        } catch (e) {
            TelegramMsg("TECH", `PackingStatus ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async CompleteRealStatus(req, res, next) {
        const {orderId} = req.body;
        try {
            const order = await Orders.findOne({
                where: {id: orderId},
                attributes: ['postMethod', 'status_id', 'source', 'paymentMethods', 'totalPrice'],
                include: [{
                    model: OrderDevice,
                },{
                    model: PaymentOrder,
                    attributes: ['status'],
                }]
            })

            if (!(order.status_id === 'in_store' && order.payment_order.status === 'paid' && order.postMethod === 'store')) {
                return next(apiError.PreconditionFailed("Замовлення в невірному статусі або не оплачене"))
            }

            const cashier = await Cashiers.findOne({
                include: [{
                    model: FopsList
                }], where: {userId: req.user.id, shift: true}
            }).catch((error) => {
                throw new Error(`Помилка касира ${error.message}`);
            })

            const checkuuid = await CheckBox.createCheck(
                {
                    orderId,
                    paymentMethods: order.paymentMethods,
                    order_devices: order.order_devices,
                    totalPrice: order.totalPrice,
                    cashier: cashier,
                    source: order.source,
                    postMethod: order.postMethod
                }
            )

            if (!checkuuid) return next(apiError.PreconditionFailed("Помилка створення чека, повторіть пізніше"))

            await Orders.update({status_id: 'completed'}, {where: {id: orderId}});
            return res.json({
                ...(checkuuid && {checkuuid_list: [{checkuuid: checkuuid, return: false}]}),
                status: 'Замовлення виконано',
            })

        } catch (e) {
            TelegramMsg("TECH", `CompleteRealStatus ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async DeliveryReady(req, res, next) {
        const {orderId} = req.body;
        try {
            const order = await Orders.findOne({
                where: {id: orderId}
            })

            if (order.status_id !== 'packing') {
                return next(apiError.PreconditionFailed("Замовлення в невірному статусі, оновіть сторінку"))
            }

            let obj = {
                status_id: order.postMethod === 'store' ? 'in_store' : 'ready-delivery'
            }
            await Orders.update(obj, {where: {id: orderId}});
            return res.json({
                status: order.postMethod === 'store' ? "Готове до вручення" : 'Готове до відправлення',
                status_id: order.postMethod === 'store' ? 'in_store' : 'ready-delivery'
            })

        } catch (e) {
            TelegramMsg("TECH", `DeliveryReady ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async OrderWithOutPRRO(req, res, next) {
        const {orderId, moneyLose} = req.body;
        try {
            await Orders.findOne({
                where: {id: orderId}, include: [{model: User}]
            }).then(async (OrderElem) => {
                let obj = {
                    totalProfit: OrderElem.totalProfit - OrderElem.totalPrice,
                    status_id: 'completed',
                    totalPrice: 0,
                    moneyCard: 0,
                    postMethod: 'store',
                    moneyLose,
                }
                await Orders.update(obj, {where: {id: orderId}});
                return res.json({
                    ...obj, status: "Замовлення виконано"
                })
            })
        } catch (e) {
            TelegramMsg("TECH", `WaitOrderInShop ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getZebraTTN(req, res, next) {
        try {
            const {orderId} = req.query;
            const order = await Orders.findOne({
                where: {id: orderId},
                attributes: [],
                include: [{model: FopsList, attributes: ["np_api_key"]}, {model: DeliveryOrder, attributes: ["ttn"]}]
            })
            await axios.post(`https://my.novaposhta.ua/orders/printMarking100x100/orders/${order.delivery_order.ttn}/type/pdf/apiKey/${order.fops_list.np_api_key}/zebra`, {}, {
                responseType: 'arraybuffer', headers: {
                    "Content-Type": "application/json"
                },
            }).then(({data}) => {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename=${order.delivery_order.ttn}.pdf`);
                return res.send(data)
            })
        } catch (e) {
            TelegramMsg("TECH", `getZebraTTN ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }


}

module.exports = new adminOrders();
