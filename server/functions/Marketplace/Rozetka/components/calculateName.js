async function calculateName(product, option, language) {

    let languageName = language && product.name_ru ? product.name_ru : product.name;
    let optionName = language && option.optionName_ru ? option.optionName_ru : option.optionName;
    let series = language && product.series_ru ? product.series_ru : product.series;
    let name = `${languageName} ${optionName} ${series}`;

    return name
        .replaceAll("&", "&amp;")
        .replaceAll(`"`, "&quot;")
        .replaceAll(">", "&gt;")
        .replaceAll("<", "&lt;")
        .replaceAll(`'`, "&apos;")

}

module.exports = calculateName;
