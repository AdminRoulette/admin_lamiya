async function calculateName(product, option, language, isColor) {

    let languageName = language && product.name_ru ? product.name_ru : product.name;
    let optionName = language && option.optionName_ru ? option.optionName_ru : option.optionName;
    let name = `${languageName}${isColor ? "" : ` ${optionName}` }`;

    return name
        .replaceAll("&", "&amp;")
        .replaceAll(`"`, "&quot;")
        .replaceAll(">", "&gt;")
        .replaceAll("<", "&lt;")
        .replaceAll(`'`, "&apos;")

}

module.exports = calculateName;
