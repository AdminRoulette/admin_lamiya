const {
    Orders,
    OrderDevice,
    Device,
    Brand,
    DeviceOptions,
    DeviceImage,
    PaymentOrder,
    DeliveryOrder,
    ChecksOrder,
    FopsList,
} = require("../models/models");
const apiError = require("../error/apierror");
const {Op} = require("sequelize");
const TelegramMsg = require("../functions/TelegramMsg");
const CalculateProductCount = require("../functions/Order/components/CalculateProductCount");
const CancelProductCount = require("../functions/Order/CancelOrder/Components/CancelProductCount");
const CalculateEditOrder = require("../functions/Order/components/CalculateEditOrder");
const UpdateStock = require("../functions/Product/UpdateStock");
const OrderFormat = require("../functions/Order/EditOrder/OrderFormat");

class OrdersController {

    async editOrder(req, res, next) {
        try {
            const {orderDevices, orderId} = req.body;
            let productIds = [];

            const order = await Orders.findOne({where: {id: orderId}})

            if (order.status_id !== 'new') {
                next(apiError.badRequest("Редагувати можна лише Нові замовлення"));
            }

            let OrderDevicesList = await OrderDevice.findAll({
                order: [[DeviceOptions, DeviceImage, "index", "ASC"]], where: {order_id: orderId}, include: [{
                    model: DeviceOptions, include: [{
                        model: Device
                    }, {
                        model: DeviceImage, attributes: ["image"]
                    }]
                }]
            });
            const oldIds = new Set(OrderDevicesList.map(item => item.id));
            const newIds = new Set(orderDevices.map(item => item.id));

            const added = orderDevices.filter(item => !oldIds.has(item.id));
            const removed = OrderDevicesList.filter(item => !newIds.has(item.id));
            const remained = OrderDevicesList.filter(item => oldIds.has(item.id));

            for (const addedItem of added) {
                await DeviceOptions.findOne({
                    order: [[DeviceImage, 'index', 'ASC']],
                    where: {id: addedItem.option_id}, include: [{
                        model: DeviceImage, attributes: ["image"]
                    }, {
                        model: Device, attributes: ['name', 'name_ru', 'series', 'series_ru', 'link', 'id']
                    }]
                }).then(async (OptionElem) => {
                    productIds.push(await CalculateProductCount({
                        oldOptionElem: OptionElem,
                        count: addedItem.count,
                        orderId,
                        userId: req.user.id,
                        actionText: "Додавання товару в замовлення"
                    }));
                    await OrderDevice.create({
                        order_id: orderId,
                        price: addedItem.price,
                        saleprice: addedItem.saleprice,
                        option_id: OptionElem.id,
                        count: addedItem.count,
                        product_name: `${OptionElem.device.name} ${OptionElem.optionName}`,
                        series: OptionElem.device.series,
                        product_name_ru: `${OptionElem.device.name_ru} ${OptionElem.optionName_ru}`,
                        series_ru: OptionElem.device.series_ru,
                        special_type: OptionElem.sell_type
                    });
                    OrderDevicesList.push({
                        order_id: orderId,
                        image: OptionElem.deviceimages[0].image,
                        deviceId: OptionElem.device.id,
                        link: OptionElem.device.link,
                        count: addedItem.count,
                        price: addedItem.price,
                        saleprice: addedItem.saleprice,
                        option_id: OptionElem.id,
                        product_name: `${OptionElem.device.name} ${OptionElem.optionName}`,
                        series: OptionElem.device.series,
                        special_type: OptionElem.sell_type,
                        deviceoption: OptionElem
                    })
                })
            }

            for (const removedItem of removed) {
                productIds.push(await CancelProductCount({
                    OptionId: removedItem.option_id,
                    count: removedItem.count,
                    orderId,
                    special_type: removedItem.special_type,
                    product_name: removedItem.product_name,
                    userId: req.user.id,
                    actionText: "Видалення товару з замовлення"
                }));
                await OrderDevice.destroy({where: {id: removedItem.id}})
                OrderDevicesList = OrderDevicesList.filter(item => item.id !== removedItem.id);
            }

            for (const remainedItem of remained) {
                for (let i = 0; i < orderDevices.length; i++) {
                    const newItem = orderDevices[i];
                    if (newItem.id === remainedItem.id) {
                        if (newItem.count !== remainedItem.count) {
                            await OrderDevice.update({
                                count: newItem.count,
                                price: newItem.price,
                                saleprice: newItem.saleprice
                            }, {where: {id: remainedItem.id}});
                            if (newItem.count < remainedItem.count) {
                                productIds.push(await CancelProductCount({
                                    OptionId: remainedItem.option_id,
                                    count: remainedItem.count - newItem.count,
                                    userId: req.user.id,
                                    orderId,
                                    special_type: remainedItem.special_type,
                                    product_name: remainedItem.product_name,
                                    actionText: "Зменшення к-сті товару з замовленні"
                                }));
                            } else {
                                productIds.push(await CalculateProductCount({
                                    oldOptionElem: remainedItem.deviceoption,
                                    count:newItem.count - remainedItem.count,
                                    orderId,
                                    userId: req.user.id,
                                    actionText: "Збільшення к-сті товару з замовленні"
                                }));
                            }
                        } else if ((newItem.price !== remainedItem.price) || (newItem.saleprice !== remainedItem.saleprice)) {
                            await OrderDevice.update({
                                price: newItem.price, saleprice: newItem.saleprice
                            }, {where: {id: remainedItem.id}});
                        }
                        OrderDevicesList[i].price = newItem.price;
                        OrderDevicesList[i].saleprice = newItem.saleprice;
                        OrderDevicesList[i].count = newItem.count;
                        break;
                    }
                }
            }

            void UpdateStock(productIds)

            await CalculateEditOrder({
                orderId,
                moneyLose:0,
                OrderDevicesList,
                promoCode: order.promo
            }).then(async (editData) => {

                let products = [];
                for (const orderDevElem of OrderDevicesList) {
                    products.push({
                        image: orderDevElem.deviceoption?.deviceimages?.[0]?.image,
                        option_id: orderDevElem.option_id,
                        name: orderDevElem.product_name,
                        series: orderDevElem.series,
                        price: orderDevElem.price,
                        saleprice: orderDevElem.saleprice,
                        count: orderDevElem.count,
                        deviceId: orderDevElem.deviceoption.device.id,
                        link: orderDevElem.deviceoption.device.link,
                        preorder: orderDevElem.special_type === 'preorder'
                    })
                }

                return res.json({...editData, products});

                // if (order.totalPrice !== edit.totalPrice) {
                //
                //     if (order.paymentType === 'mono') {
                //         let deviceBasket = []
                //         for (const orderDev of OrderDevicesList) {
                //             deviceBasket.push({
                //                 name: `${orderDev.deviceoption.device.name} ${orderDev.deviceoption.option}`,
                //                 count: orderDev.count,
                //                 saleprice: orderDev.sale_price,
                //                 price: orderDev.price,
                //                 img: orderDev.deviceoption.deviceimages[0].image,
                //             })
                //         }
                //         await MerchantInvoice({
                //             totalPrice: edit.totalPrice, deviceBasket, orderId, reNew: true
                //         }).catch((error) => {
                //             TelegramMsg("TECH", `getMonoLink#1 ${error.message}`)
                //         })
                //     } else if (order.paymentType === 'privat_part') {
                //         try {
                //             await PrivatPartPayments.cancel({orderId: order.payment_orders?.invoiceId})
                //             const privat_order_id = `lamiya-${new Date().getTime()}`;
                //             await PrivatPartPayments.createOrder({
                //                 orderId: orderId,
                //                 privat_order_id: privat_order_id,
                //                 phone: partPaymentInfo.finance_phone,
                //                 partPaymentAmount: partPaymentInfo.partPaymentAmount,
                //                 order_devices: orderDevices,
                //                 totalPrice: totalPrice
                //             }).then(res => {
                //                 PaymentOrder.update({
                //                     invoiceId: privat_order_id,
                //                     orderId,
                //                     status: "processing",
                //                     sub_status: "",
                //                     lastInvoiceUpdate: Date.now(),
                //                     link: `https://payparts2.privatbank.ua/ipp/v2/payment?token=${res.token}`
                //                 }, {where: {orderId: orderId}});
                //             })
                //         } catch (error) {
                //             // Тут варто писати текст помилки в Sub_state?
                //             PaymentOrder.update({
                //                 invoiceId: privat_order_id, orderId, status: "failure", lastInvoiceUpdate: Date.now()
                //             }, {where: {orderId: orderId}});
                //         }
                //     }
                //
                // } else if (order.paymentType === 'mono_part') {
                //     try {
                //         await MonoPartPayments.rejectOrder({order_id: order.payment_orders?.invoiceId})
                //         await MonoPartPayments.createOrder({
                //             orderId: orderId,
                //             phone: partPaymentInfo.finance_phone,
                //             partPaymentAmount: partPaymentInfo.partPaymentAmount,
                //             order_devices: orderDevices,
                //             totalPrice: totalPrice
                //         }).then(res => {
                //             PaymentOrder.update({
                //                 invoiceId: res.order_id, status: "processing", sub_status: "", lastInvoiceUpdate: Date.now()
                //             }, {where: {orderId: orderId}});
                //         })
                //     } catch (error) {
                //         PaymentOrder.update({
                //             invoiceId: privat_order_id, orderId, status: "failure", lastInvoiceUpdate: Date.now()
                //         }, {where: {orderId: orderId}});
                //     }
                // }
                //
                // if (order.delivery_order?.ttn) {
                //     let weight = 0;
                //     OrderDevicesList.forEach((orderDevElem) => {
                //         weight += orderDevElem.deviceoption.weight;
                //     })
                //     if (order.postMethod === 'np') {
                //         if (!order.delivery_order?.printed) {
                //             await CreateTTNNovaPost({
                //                 deliveryPay: edit.totalPrice < 799,
                //                 weight: (weight / 1000),
                //                 ttnRef: order.delivery_order.ttnRef,
                //                 Cost: edit.totalPrice,
                //                 Recipient: order.delivery_order.recipientRef,
                //                 ContactRecipient: order.delivery_order.contactRecipientRef,
                //                 RecipientsPhone: order.delivery_order.mobile,
                //                 RecipientAddress: order.delivery_order.warehouseRef,
                //                 moneyBack: order.delivery_order.moneyBack > 0 ? edit.totalPrice : undefined,
                //                 cityRecipient: order.delivery_order.cityRef,
                //                 calledMethod: 'update',
                //                 fop: order.fops_list
                //             }).then((novaPoshtaRes) => {
                //                 DeliveryOrder.update({
                //                     ttn: novaPoshtaRes.IntDocNumber,
                //                     deliveryPrice: Math.ceil(novaPoshtaRes.CostOnSite),
                //                     ttnRef: novaPoshtaRes.Ref,
                //                     deliveryPay: edit.totalPrice < 799,
                //                 }, {where: {orderId}})
                //                 result = {
                //                     ...result,
                //                     ttn: novaPoshtaRes.IntDocNumber,
                //                     deliveryPrice: Math.ceil(novaPoshtaRes.CostOnSite),
                //                     deliveryPay: edit.totalPrice < 799
                //                 }
                //             }).catch(e => {
                //                 TelegramMsg("TECH", `Edit Нова пошта update TTN ${e.message}`)
                //                 return next(apiError.badRequest(e.message));
                //             })
                //         } else {
                //             await CreateTTNNovaPost({
                //                 deliveryPay: edit.totalPrice < 799,
                //                 weight: (weight / 1000),
                //                 ttnRef: order.delivery_order.ttnRef,
                //                 Cost: edit.totalPrice,
                //                 Recipient: order.delivery_order.recipientRef,
                //                 ContactRecipient: order.delivery_order.contactRecipientRef,
                //                 RecipientsPhone: order.delivery_order.mobile,
                //                 RecipientAddress: order.delivery_order.warehouseRef,
                //                 moneyBack: order.delivery_order.moneyBack > 0 ? edit.totalPrice : undefined,
                //                 cityRecipient: order.delivery_order.cityRef,
                //                 calledMethod: 'save',
                //                 fop: order.fops_list
                //             }).then((novaPoshtaRes) => {
                //                 EditOrder.deleteNovaPostTTN({
                //                     Ref: order.delivery_order.ttnRef, np_api_key: order.fops_list.np_api_key
                //                 });
                //                 DeliveryOrder.update({
                //                     ttn: novaPoshtaRes.IntDocNumber,
                //                     deliveryPrice: Math.ceil(novaPoshtaRes.CostOnSite),
                //                     ttnRef: novaPoshtaRes.Ref,
                //                     deliveryPay: edit.totalPrice < 799,
                //                 }, {where: {orderId}})
                //                 result = {
                //                     ...result,
                //                     ttn: novaPoshtaRes.IntDocNumber,
                //                     deliveryPrice: Math.ceil(novaPoshtaRes.CostOnSite),
                //                     deliveryPay: edit.totalPrice < 799
                //                 }
                //             }).catch(e => {
                //                 TelegramMsg("TECH", `Edit Нова пошта new TTN ${e.message}`)
                //                 return next(apiError.badRequest(e.message));
                //             })
                //         }
                //     } else if (order.postMethod === 'ukr' || order.postMethod === 'ukr_standart') {
                //         await CreateTTNUkrPost({
                //             recipient: order.delivery_order.recipientRef,
                //             whoPayDelivery: edit.totalPrice < 799,
                //             weight,
                //             declaredPrice: edit.totalPrice,
                //             postPay: order.delivery_order.moneyBack > 0 ? edit.totalPrice : undefined,
                //             type: order.postMethod === 'ukr_standart' ? "STANDARD" : "EXPRESS",
                //             fop: order.fops_list
                //         }).then((ukrPoshtaRes) => {
                //             DeliveryOrder.update({
                //                 ttn: ukrPoshtaRes.barcode,
                //                 deliveryPrice: Math.ceil(ukrPoshtaRes.deliveryPrice),
                //                 ttnRef: ukrPoshtaRes.uuid,
                //                 deliveryPay: edit.totalPrice < 799
                //             }, {where: {orderId}})
                //             EditOrder.deleteUkrPostTTN({uuid: order.delivery_order.ttnRef});
                //             result = {
                //                 ...result,
                //                 ttn: ukrPoshtaRes.barcode,
                //                 deliveryPrice: Math.ceil(ukrPoshtaRes.deliveryPrice),
                //                 deliveryPay: edit.totalPrice < 799
                //             }
                //         }).catch(e => {
                //             TelegramMsg("TECH", `Edit Укр пошта ${e.message}`)
                //             return next(apiError.badRequest(e.message));
                //         })
                //     }
                // }
            })

        } catch (e) {
            TelegramMsg("TECH", `editOrder ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async getOrderEdit(req, res, next) {
        try {
            const {id} = req.params;
            let OrderDeviceArray = [];
            const orderElem = await Orders.findOne({
                order: [[OrderDevice, DeviceOptions, DeviceImage, "index", "ASC"]], where: {id}, include: [{
                    model: OrderDevice, include: [{
                        model: DeviceOptions, include: [{model: DeviceImage}, {
                            model: Device, include: [{model: Brand}]
                        }]
                    }]
                }]
            })
            for (const orderDevElem of orderElem.order_devices) {
                const deviceElem = orderDevElem.deviceoption.device;
                OrderDeviceArray.push({
                    id: orderDevElem.id,
                    image: orderDevElem.deviceoption.deviceimages[0]?.image,
                    option_id: orderDevElem.option_id,
                    product_name: orderDevElem.product_name,
                    series: orderDevElem.series,
                    price: orderDevElem.price,
                    saleprice: orderDevElem.saleprice,
                    count: orderDevElem.count,
                    deviceId: deviceElem.id
                })
            }
            return res.json(OrderDeviceArray);
        } catch (e) {
            TelegramMsg("TECH", `getAdminOneOrderForEdit ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }

    async ApprovalPayment(req, res, next) {
        try {
            const {orderId} = req.body;
            const payment = await PaymentOrder.findOne({where: {orderId: orderId}})

            if (!payment) {
                throw new Error("Оплату для цього замовлення не знайдено");
            }

            if (payment.status === 'paid') {
                throw new Error("Замовлення вже оплачене");
            }

            if (payment.status === 'processing' || payment.status === 'not_paid') {
                await PaymentOrder.update({
                    status: 'paid',
                }, {where: {orderId: orderId}})

                return res.json({payment_status: 'paid'});
            }else{
                throw new Error("Замовлення вже оплачене");
            }


        } catch (e) {
            TelegramMsg("TECH", `ApprovalPayment ${e.message}`)
            next(apiError.badRequest("Помилка підтвердження оплати"));
        }
    }

    async getAdminOrderList(req, res, next) {
        try {
            const {type} = req.params;
            const {ttn, id, product_id} = req.query;
            const phone = req.query.phone?.trim();
            const user = req.user;

            let OrdersArray = [];
            let whereQuery = [];
            let whereDelivery = null;
            let where = type === 'new' ? {status_id: {[Op.in]: ['new', 'created']}} : type === 'in-progress' ? {status_id: 'packing'} : type === 'delivery-ready'
                ? {status_id: {[Op.in]: ['ready-delivery', 'in_store']}} : type === 'delivering' ? {status_id: {[Op.in]: ['delivery', 'ready-pickup']}}
                    : type === 'canceled' ? {status_id: {[Op.in]: ['cancelled', 'cancelled-us']}} : type === 'failed' ? {status_id: {[Op.in]: ['refused', 'refused-return']}} : {}
            if (phone) whereQuery.push({mobile: {[Op.like]: phone.length === 12 ? `+${phone}` : `%${phone}`}})
            if (id) where = {id: Number(id)}
            if (ttn) whereQuery.push({ttn: {[Op.like]: `%${ttn}`}})

            if (whereQuery.length > 0) {
                whereDelivery = {[Op.or]: whereQuery}
            }
            if (user.role?.includes("SELLER") && !(type === 'in-progress' || type === "delivery-ready")) {
                where = {[Op.and]: [where, {[Op.or]: [{postMethod: 'store'}, {userId: user.id}]}]}
            }
            // if (product_id) where = {...where, '$order_devices.deviceoption.device.id$': product_id};
            // console.log(where)

            const orders = await Orders.findAll({
                limit: 150,
                order: [['id', 'DESC'], [OrderDevice, 'price', 'DESC'], [OrderDevice, DeviceOptions, DeviceImage, 'index', 'ASC'], [ChecksOrder, 'id', 'ASC']],
                where,
                include: [{
                    model: OrderDevice,
                    attributes: ['count', 'product_name', 'series', 'special_type', "price", "saleprice", 'option_id', 'id'],
                    where: product_id ? {option_id: product_id} : {},
                    include: [{
                        model: DeviceOptions, include: [{
                            model: DeviceImage, attributes: ["image"]
                        }, {
                            model: Device, attributes: ['name', 'id', 'link']
                        }]
                    }]
                }, {
                    model: PaymentOrder, attributes: ["status", "sub_status", "link", "lastInvoiceUpdate"],
                }, {
                    model: ChecksOrder, attributes: ["checkuuid", 'return'],
                }, {
                    model: DeliveryOrder,
                    attributes: ['full_delivery_address', 'email', "ttn", 'firstName', 'lastName', 'moneyBack', 'mobile', 'deliveryPay', 'deliveryPrice', 'deliveryDate'],
                    where: whereDelivery ? whereDelivery : undefined
                }, {
                    model: FopsList, attributes: ["name"]
                }]
            });
            for (const orderElem of orders) {
                OrdersArray.push(await OrderFormat({orderElem}));
            }
            return res.json(OrdersArray);
        } catch (e) {
            TelegramMsg("TECH", `getAdminOrderList ${e.message}`)
            next(apiError.badRequest(e.message));
        }
    }
}

module.exports = new OrdersController();
