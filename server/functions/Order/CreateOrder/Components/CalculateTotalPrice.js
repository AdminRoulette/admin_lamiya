async function CalculateTotalPrice({promo,OptionElem,count}) {
    let totalProfit = 0;
    let totalPrice = 0;
    if (promo) {
        if (promo.percent) {
            if (OptionElem.saleprice > 0) {
                totalProfit += (OptionElem.saleprice - OptionElem.startPrice) * count;
                totalPrice += OptionElem.saleprice * count;
            } else {
                totalProfit += (OptionElem.price - OptionElem.startPrice) * count - ((OptionElem.price * count) - (OptionElem.price * count * ((100 - promo.sum) / 100)));
                totalPrice += OptionElem.price * count * ((100 - promo.sum) / 100);
            }
        } else {
            if (OptionElem.saleprice > 0) {
                totalProfit += (OptionElem.saleprice - OptionElem.startPrice) * count;
                totalPrice += OptionElem.saleprice * count;
            } else {
                totalProfit += (OptionElem.price - OptionElem.startPrice) * count;
                totalPrice += OptionElem.price * count;
            }
        }
    } else {
        if (OptionElem.saleprice > 0) {
            totalProfit += (OptionElem.saleprice - OptionElem.startPrice) * count;
            totalPrice += OptionElem.saleprice * count;
        } else {
            totalProfit +=(OptionElem.price - OptionElem.startPrice)  * count;
            totalPrice += OptionElem.price * count;
        }
    }
    return {totalProfit:totalProfit,totalPrice:totalPrice}
}
module.exports = CalculateTotalPrice;