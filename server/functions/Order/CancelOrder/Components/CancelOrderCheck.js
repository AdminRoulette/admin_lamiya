const TelegramMsg = require("../../../TelegramMsg");
const CheckBox = require("../../../CheckBox/CheckBox");
const {
    Shops,
    FopsList,
    Orders,
    ChecksOrder,
    Cashiers, CheckOrderQueue
} = require("../../../../models/models");


async function CancelOrderCheck(order_id) {
    try {
        let checkuuid = null;
        const order = await Orders.findOne({
            where: {id: order_id},
            order: [[ChecksOrder, 'id', 'DESC']],
            include: [{model: ChecksOrder}]
        })
        if (order.checks_orders?.length > 0 && !order.checks_orders[0].return) {
            try {
                const fops_list = await FopsList.findOne({
                    where: {id: order.fop_id},
                    include: [{model: Cashiers, limit: 1, order: [['shift', 'DESC']]}]
                })
                if (!fops_list || !fops_list.cashiers || fops_list.cashiers.length === 0) {
                    throw new Error('Кассир не найден')
                }

                const cashier = fops_list.cashiers[0];

                if (!cashier.shift) {
                    throw new Error("Зміна закрита")
                }

                await CheckBox.statusShifts(fops_list.key, cashier.bearer).then(async (statusShifts) => {
                        await CheckBox.CheckInfo({
                            id: order.checks_orders[0].checkuuid,
                            LicenseKey: fops_list.key,
                            Bearer: cashier.bearer
                        }).then(async checkInfo => {
                            await CheckBox.cancelCheck(checkInfo, fops_list.key, cashier.bearer).then(async (uuid) => {

                                await ChecksOrder.create({
                                    checkuuid: uuid, orderId: order_id, return: true
                                })
                                checkuuid = uuid
                                const cash_payment = order.paymentMethods.find(payment => payment.type === 'cash')
                                if (order.postMethod === 'store' && cash_payment) {
                                    const shop = await Shops.findOne({where: {id: cashier.shop_id}});
                                    await Shops.update({cash: shop.cash - cash_payment.amount}, {where: {id: cashier.shop_id}})
                                }
                                const fop = await FopsList.findOne({where: {id: fops_list.id}});
                                await FopsList.update({cash: fop.total_sell - order.totalPrice}, {where: {id: fops_list.id}})
                                if (process.env.NODE_ENV === "production") {
                                    TelegramMsg("ORDER", `Чек повернуто. Замовлення №${order_id}`)
                                }
                            })
                        })
                })
            } catch (error) {
                throw new Error(error.message)
                return null;
            }
        }

        return checkuuid;
    } catch (error) {
        TelegramMsg("TECH", `Помилка створення чека повернення №2 ${error.message}`)
        return null;
    }

}

module.exports = CancelOrderCheck;
