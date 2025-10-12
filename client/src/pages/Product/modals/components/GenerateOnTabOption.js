function GenerateOnTabOption(volume,on_tab_price) {
    const multiplier = volume === 3 ? 1.25 : volume === 5 ? 1.24 : 1.22
    const correct_on_tab_price = on_tab_price < 30 ? on_tab_price + 5 : on_tab_price;
    return {
        startPrice: `${Math.ceil(on_tab_price * volume / 5) * 5 + 20}`,
        price: `${Math.ceil(correct_on_tab_price * volume * multiplier / 5) * 5 + 20}`,
        marketPrice: `${Math.ceil(correct_on_tab_price * volume * multiplier * 1.15 / 5) * 5 + 20}`
    };
}
module.exports = GenerateOnTabOption;