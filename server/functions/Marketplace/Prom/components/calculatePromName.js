function calculatePromName(product, option, language, isParfume) {
    let languageName = language && product.name_ru ? product.name_ru : product.name;
    let optionName = language && option.optionName_ru ? option.optionName_ru : option.optionName;
    let series = language && product.series_ru ? product.series_ru : product.series;
    let name = `${languageName} ${optionName} ${series}`;
    let onTabText = language ? "распив " : "розпив ";
    if (isParfume) {
            name = `${language? "Оригинал":"Оригінал"} ${languageName} ${option.sell_type === "on_tab"? onTabText : ""}${optionName} ${series}`
    }
    return name
        .replaceAll("&", "&amp;")
        .replaceAll(`"`, "&quot;")
        .replaceAll(">", "&gt;")
        .replaceAll("<", "&lt;")
        .replaceAll(`'`, "&apos;")

}

module.exports = calculatePromName;
