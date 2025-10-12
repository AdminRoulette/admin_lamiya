const {
    Orders, OrderDevice, DeviceOptions, Device, Brand, User, ChecksOrder, PaymentOrder,
    DeliveryOrder, Cashiers, FopsList, UserStats, StockHistory
} = require("../../models/models");
const CancelProductCount = require("../../functions/Order/CancelOrder/Components/CancelProductCount");
const apiError = require("../../error/apierror");
const UpdateStock = require("../../functions/Product/UpdateStock");
const CancelOrderCheck = require("../../functions/Order/CancelOrder/Components/CancelOrderCheck");


class cancelOrder {
    async cancel(req, res, next) {
        try {
            const {orderId, moneyLose, refuse} = req.body;
            let newMoneyCard = 0 - moneyLose;
            let productIds = [];
            let checkuuid;
            if (!orderId) {
                return next(apiError.badRequest('Замовлення не знайдено!'));
            }

            const order = await Orders.findOne({
                where: {id: orderId},
                include: [{
                    model: OrderDevice, include: [{
                        model: DeviceOptions, include: [{
                            model: Device, include: [{model: Brand}]
                        }]
                    }]
                },{model: ChecksOrder},{model: DeliveryOrder}]
            })

            if (!order) {
                return next(apiError.badRequest('Замовлення не знайдено'));
            }

            if (order.status_id === 'cancelled' || order.status_id === "cancelled-us") {
                return next(apiError.badRequest('Це замовлення вже було відмінене'));
            }
            if(order.checks_orders?.length > 0 && !order.checks_orders[0].return) {
                checkuuid = await CancelOrderCheck(order.id);
                if (!checkuuid) {
                    return next(apiError.badRequest('Помилка відміни чека, спробуйте пізніше'));
                }
            }

            for (const order_device of order.order_devices) {
                const deviceId = await CancelProductCount({
                    OptionId: order_device.option_id,
                    count: order_device.count,
                    special_type: order_device.special_type,
                    product_name: order_device.product_name,
                    orderId: orderId,
                    userId:req.user.id,
                    actionText: "Відміна замовлення",
                });
                productIds.push(deviceId)
            }
            UpdateStock(productIds)

            await Orders.update({
                status_id: order.status_id === 'refused' || order.status_id === 'refused-return' ? 'cancelled-us' : 'cancelled',
                totalProfit: 0 - moneyLose,
                moneyCard: newMoneyCard,
                moneyLose: moneyLose,
                fop_id:order.fop_id
            }, {where: {id: orderId}})

            await DeliveryOrder.update({moneyBack: 0}, {where: {orderId}})

            const user_stats = await UserStats.findOne({where: {phone: order.delivery_order.mobile}});
            if(user_stats){
                const completed_orders = user_stats.completed_orders - 1;
                if(refuse){
                    await UserStats.update({
                        completed_orders,
                        completed_percent:Number(((completed_orders / user_stats.total_orders ) * 100).toFixed(2)),
                        failed_orders: user_stats.failed_orders + 1
                    },{where:{id:user_stats.id}});

                }else{
                    const total_orders = user_stats.total_orders - 1
                    await UserStats.update({
                        completed_orders,
                        completed_percent: total_orders === 0 ? 100 : ( completed_orders / total_orders ) * 100,
                        total_orders
                    },{where:{id:user_stats.id}});
                }
            }

            return res.json({
                status: order.status_id === 'refused' || order.status_id === 'refused-return' ? "Відмова від отримання. Скасовано" : "Скасовано",
                id: orderId,
                status_id: order.status_id === 'refused' || order.status_id === 'refused-return' ? 'cancelled-us' : 'cancelled',
                totalProfit: 0,
                moneyCard: newMoneyCard,
                moneyBack: 0,
                moneyLose: moneyLose,
                ...(checkuuid && {checkuuid_list: [{checkuuid: checkuuid,return:true}]})
            })
        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }
}

module.exports = new cancelOrder();
