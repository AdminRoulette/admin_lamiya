async function CalculateSellBottlePrice(on_tab_price, partcount) {
    const correct_on_tab_price = on_tab_price < 30 ? on_tab_price + 5 : on_tab_price;
    let price;
    if(partcount < 5){
        price = Math.ceil(correct_on_tab_price * partcount * 1.25 / 5) * 5 + 20
    }else if(partcount < 10){
        price = Math.ceil(correct_on_tab_price * partcount * 1.24 / 5) * 5 + 20
    }else{
        price = Math.ceil(correct_on_tab_price * partcount * 1.22 / 5) * 5 + 20
    }
    return price;
}
module.exports = CalculateSellBottlePrice;