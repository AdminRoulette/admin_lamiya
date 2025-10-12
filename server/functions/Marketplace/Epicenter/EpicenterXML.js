const calculateImg = require("../Rozetka/components/calculateImg");
const calculateName = require("../Rozetka/components/calculateName");
const countryEpicenter = require("./components/ParfumsParam/countryEpicenter");
const EpicenterParfumsParam = require("./components/ParfumsParam/epicenterParfumsParam");
const EpicenterCosmeticsParam = require("./components/CosmeticsParam/EpicenterCosmeticsParam");
const brandEpicenter = require("./components/brandEpicenter");
const categoryEpicenter = require("./components/categoryEpicenter");
const TelegramMsg = require("../../TelegramMsg");

async function EpicenterXML(option, product) {
    const {name, categoryId} = await categoryEpicenter(product.product_categories[0]?.categoryId)
    const {brandName, brandId} = await brandEpicenter(product.brandId)
    const {countryName, countryId} = await countryEpicenter(product.countryId)
    let price = option.marketPrice > 0 ? option.marketPrice : option.price;

    if (!categoryId || !brandId || !countryId) {
         // TelegramMsg("TECH", `Epicenter Empty Product Data ${product.id}`)
        return {}
    }
    let paramArray = [{
        '#': "шт.",'@paramcode': 'measure', '@name': 'Одиниця виміру та кількість', '@valuecode': "measure_pcs"
    }, {'#': 1, '@paramcode': 'ratio', '@name': 'Мінімальна кратність товару'}];
    let images = [];

    for (const image of await calculateImg(product, option)) {
        images.push(image);
    }
    if (option.gtin) {
        paramArray.push({'#': option.gtin.toString(), '@paramcode': 'barcodes', '@name': 'Штрих код'})
    }
    if (option.weight) {
        paramArray.push({'#': Number(option.weight), '@paramcode': 'weight', '@name': 'Вага'})
        paramArray.push({'#': option.weight, '@paramcode': '1098', '@name': "Об'єм"})
    }

    // if (product.product_categories.some(item => item.categoryId === 60)) {
    //     await EpicenterParfumsParam(option, product, paramArray)
    // } else {
    //     await EpicenterCosmeticsParam(option, product, paramArray)
    // }

    return {
        offer: {
            '@id': `${product.id}_${option.id}`,
            '@available': option.count > 0 || option.sell_type === "preorder" || option.sell_type  === "storage" ? "true" : "false",
            price: price,
            price_old: price,
            category: {'#': name, '@code': categoryId},
            picture: images,
            name: [{'#': await calculateName(product, option, true), '@lang': 'ru'},
                {'#': await calculateName(product, option, false), '@lang': 'ua'}],
            attribute_set: {'#': name, '@code': categoryId},
            description: [
                {'$': product.disc_ru ? product.disc_ru.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1") : product.disc ? product.disc.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1") : "",
                '@lang': 'ru'},
                {'$': product.disc ? product.disc.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1") : "", '@lang': 'ua'}],
            param: paramArray,
            vendor: {'#': brandName.replaceAll("&", "&amp;"), '@code': brandId},
            country_of_origin: {'#': countryName, '@code': countryId},
            height: '200',
            length: '30',
            width: '100'
        }
    }
}

module.exports = EpicenterXML;
