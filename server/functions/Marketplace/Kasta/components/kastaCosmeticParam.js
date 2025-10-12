const kastaSPFs = require("./KastaCosmeticParams/kastaSPFs");
const kastaPurposes = require("./KastaCosmeticParams/kastaPurposes");
const kastaSkinTypes = require("./KastaCosmeticParams/kastaSkinTypes");
const kastaClassifications = require("./KastaCosmeticParams/kastaClassifications");
const kastaMaskTypes = require("./KastaCosmeticParams/kastaMaskTypes");
const kastaEffect = require("./KastaCosmeticParams/kastaEffect");
const kastaStructura = require("./KastaCosmeticParams/kastaStructura");
const kastaColor = require("./KastaCosmeticParams/kastaColor");

async function kastaCosmeticParam(option, product, paramArray) {

    // if (product.product_categories.some(item => item.categoryId === 29 || item.categoryId === 73)) {
    //     paramArray.push({
    //         '#': Number(option.weight),
    //         '@paramid': '92802',
    //         '@name': 'Кількість в упаковці, шт.',
    //         '@valueid': await calculatePatchesCount(Number(option.weight), product.id)
    //     })
    // } else if (!product.product_categories.some(item => item.categoryId === 54 || item.categoryId === 55 || item.categoryId === 106 || item.categoryId === 105)) {
    //     paramArray.push({
    //         '#': Number(option.weight),
    //         '@paramid': '199674',
    //         '@name': "Об'єм",
    //         '@valueid': await calculateVolume(Number(option.weight), product.id)
    //     })
    // }

    paramArray.push({
            '#': Number(option.weight),
            '@name': "Об'єм"
        })
    paramArray.push({
        '#': Number(option.weight),
        '@name': "Вага"
    })
    if (product.bodycarepart?.composition) {
        paramArray.push({
            '#': `${product.bodycarepart.composition
                .replaceAll(`"`, "&quot;")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;")
                .replaceAll("&", "&amp;")}`,
            '@paramid': '56287', '@name': "Склад"
        })
    }
    if (product.bodycarepart?.applicationmethod) {
        paramArray.push({
            '#': `${product.bodycarepart.applicationmethod
                .replaceAll(`"`, "&quot;")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;")
                .replaceAll("&", "&amp;")}`,
            '@name': "Спосіб застосування"

        })
    }
    paramArray.push({
        '#': "Без обмежень",
        '@name': 'Вік',
    })
    paramArray.push({
        '#': "Універсальний",
        '@name': 'Час застосування',
    })
    await kastaClassifications(product?.filters?.classification, paramArray)
    await kastaSkinTypes(product?.filters?.skin, paramArray)
    await kastaPurposes(product?.filters?.purpose, paramArray)
    await kastaSPFs(product?.filters?.purpose, paramArray)
    const categoryId = product.product_categories[0].categoryId;
    if (categoryId === 98) {
        paramArray.push({
            '#': "Спрей",
            '@name': 'Тара/упаковка',
        })
    } else if (categoryId === 5) {

    } else if (categoryId === 19) {
        await kastaMaskTypes(product?.filters?.mask, paramArray)
    } else if (categoryId === 32) {
        await kastaPurposes(product?.filters?.purpose, paramArray)
        await kastaSPFs(product?.filters?.purpose, paramArray)
        await kastaSkinTypes(product?.filters?.skin, paramArray)
        await kastaMaskTypes(product?.filters?.mask, paramArray)
        await kastaClassifications(product?.filters?.classification, paramArray)
    } else if (categoryId === 22 || categoryId === 77) {
        paramArray.push({
            '#': "Спрей",
            '@name': 'Тара/упаковка',
        })
    } else if (categoryId === 23) {
        await kastaMaskTypes(product?.filters?.mask, paramArray)
    } else if (categoryId === 130) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 70) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 51) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 126) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 127) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 129) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 128) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 125) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 131) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 113) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
    } else if (categoryId === 114) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 116) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 115) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 123) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 122) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 124) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 121) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 120) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 119) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 117) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else if (categoryId === 118) {
        await kastaEffect(product?.filters?.shade, product?.filters?.mascara, paramArray)
        await kastaStructura(product?.filters?.texture, paramArray)
        await kastaColor(product?.filters?.color, paramArray)
    } else {
        return ""
    }
}

module.exports = kastaCosmeticParam;
