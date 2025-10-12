const {Orders, PromoCodes} = require("../../../models/models");
const CalculateTotalPrice = require("../CreateOrder/Components/CalculateTotalPrice");

async function CalculateEditOrder({orderId, moneyLose, OrderDevicesList, promoCode}) {
    try {
        let totalProfit = 0;
        let totalPrice = 0;
        let promo = null;

        if (promoCode) {
            promo = await PromoCodes.findOne({
                where: {code: promoCode}
            });
        }

        for (const orderDeviceItem of OrderDevicesList) {
            const OptionElem = {
                saleprice: orderDeviceItem.saleprice,
                price: orderDeviceItem.price,
                startPrice: orderDeviceItem.deviceoption.startPrice,
            };
            await CalculateTotalPrice({promo, OptionElem, count: orderDeviceItem.count}).then((calcTotalPriceRes) => {
                totalProfit += calcTotalPriceRes.totalProfit;
                totalPrice += calcTotalPriceRes.totalPrice;
            });
        }

        const result = {
            moneyLose,
            totalProfit: totalProfit - moneyLose,
            totalPrice: totalPrice,
            moneyCard: totalPrice - moneyLose
        }

        Orders.update(
            result,
            {where: {id: orderId}}
        );

        return result;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = CalculateEditOrder;
