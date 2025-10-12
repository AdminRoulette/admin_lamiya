const {PromoCodes} = require("../../../models/models");


async function CalculatePromoAndNoSalePrice({promoCode, totalProfit, totalPrice, OrderElem}) {
    let promo;
    let newTotalPrice = 0;
    let newTotalProfit = 0;
    if (promoCode) {
        promo = await PromoCodes.findOne({
            where: {code: promoCode}
        });
    }

    if (promo && promo.percent) {
        OrderElem.order_devices.forEach((orderDevElem) => {
            if (orderDevElem.salePrice > 0) {
                newTotalProfit += orderDevElem.profit * orderDevElem.count;
                newTotalPrice += orderDevElem.salePrice * orderDevElem.count;
            } else {
                newTotalProfit += (orderDevElem.profit - (orderDevElem.price - orderDevElem.price * ((100 - promo.sum) / 100))) * orderDevElem.count
                newTotalPrice += orderDevElem.price * orderDevElem.count * ((100 - promo.sum) / 100);
            }
        })
    }

    if (promo && !promo.percent) {
        newTotalProfit = (newTotalProfit !== 0 ? newTotalProfit : totalProfit) - promo.sum;
        newTotalPrice = (newTotalPrice !== 0 ? newTotalPrice : totalPrice) - promo.sum;
    }


    return {totalProfit: newTotalProfit, totalPrice: newTotalPrice}
}

module.exports = CalculatePromoAndNoSalePrice;