const IbanPaymentLink = require("../components/IbanPaymentLink");
const GenerateOrderStatus = require("../CreateOrder/Components/GenerateOrderStatus");

async function OrderFormat({orderElem}) {
    try {
        let OrderDeviceArray = [];
        let ProductCount = 0;
        for (const orderDevElem of orderElem.order_devices) {
            let deviceElem = orderDevElem.deviceoption.device;
            ProductCount += orderDevElem.count;
            OrderDeviceArray.push({
                image: orderDevElem.deviceoption?.deviceimages?.[0]?.image,
                option_id: orderDevElem.option_id,
                name: orderDevElem.product_name,
                series: orderDevElem.series,
                price: orderDevElem.price,
                saleprice: orderDevElem.saleprice,
                count: orderDevElem.count,
                deviceId: deviceElem.id,
                link: deviceElem.link,
                special_type: orderDevElem.special_type
            })
        }
        const payment_type = orderElem?.paymentMethods.length === 1 ? orderElem?.paymentMethods[0].type : "combo";
        return {
            id: orderElem.id,
            fop: orderElem.fops_list?.name,
            products: OrderDeviceArray,
            ...(orderElem.delivery_order && {
                email: orderElem.delivery_order.email,
                firstName: orderElem.delivery_order.firstName,
                lastName: orderElem.delivery_order.lastName,
                mobile: orderElem.delivery_order.mobile,
                address: orderElem.delivery_order.full_delivery_address,
                ttn: orderElem.delivery_order.ttn,
                deliveryPrice: orderElem.delivery_order.deliveryPrice,
                deliveryPay: orderElem.delivery_order.deliveryPay,
                ...(+orderElem.delivery_order.deliveryDate && {
                    deliveryDate: new Date(+orderElem.delivery_order.deliveryDate).toLocaleString('uk-UA', {
                        year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'Europe/Kiev'
                    }).replace(",", "")
                }),
            }), ...(orderElem.payment_order && {
                payment_status: orderElem.payment_order.status,
                payment_sub_status: orderElem.payment_order.sub_status,
                payment_link: orderElem.payment_order.link,
                ...((payment_type === 'account' && orderElem.payment_order.status !== 'paid') && {
                    iban_link: await IbanPaymentLink({
                        price: orderElem.totalPrice, order_id: orderElem.id
                    })
                })
            }),
            payment_type: payment_type,
            paymentMethods: orderElem.paymentMethods,
            promo: orderElem.promo,
            comment: orderElem.comment,
            privacy_comment: orderElem.privacy_comment,
            postMethod: orderElem.postMethod,
            status: await GenerateOrderStatus(orderElem.status_id),
            status_id: orderElem.status_id,
            totalPrice: orderElem.totalPrice,
            source: orderElem.source,
            ProductCount: ProductCount,
            warning_msg: orderElem.delivery_order?.deliveryPay === 'sender' && (orderElem.postMethod.startsWith('ukr')) ? "Оплатити доставку на Укр пошті" : undefined,

            created_date: new Date(orderElem.createdAt).toLocaleString('uk-UA', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                timeZone: 'Europe/Kiev',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
            }).replace(",", ""),
            checkuuid_list: orderElem.checks_orders,
            moneyCard: orderElem.moneyCard,
            totalProfit: orderElem.totalProfit,
            moneyLose: orderElem.moneyLose
        }
    }catch (error){
        throw new Error("CalculateEditOrder");
    }
}

module.exports = OrderFormat;
