const calculateCategoryId = require("./components/calculateCategoryId");
const calculateImg = require("./components/calculateImg");
const calculateName = require("./components/calculateName");
const calculateCountry = require("./components/calculateCountry");
const TelegramMsg = require("../../TelegramMsg");
const ParfumeParam = require("./components/Parfumes/ParfumeParam");
const CosmeticsParam = require("./components/Cosmetic/CosmeticsParam");

async function RozetkaXML(option, product, marketName = 'rozetka') {
    const categoryId = await calculateCategoryId(product.product_categories[0].categoryId);
    let price = option.price;
        if (option.marketPrice > 0) {
            if (categoryId === "1" || categoryId === "2") {
                if (option.marketPrice > 13000) {
                    price = option.marketPrice * 0.874
                } else if (option.marketPrice > 5000) {
                    price = option.marketPrice * 0.928
                } else if (option.marketPrice > 3000) {
                    price = option.marketPrice * 0.982
                } else {
                    price = option.marketPrice
                }
            } else {
                if (option.marketPrice > 5000) {
                    price = option.marketPrice * 0.895
                } else if (option.marketPrice > 2600) {
                    price = option.marketPrice * 0.928
                } else if (option.marketPrice > 600) {
                    price = option.marketPrice * 0.982
                } else {
                    price = option.marketPrice
                }
            }
        }


    const {name, id, brandId} = await calculateCountry(product.countryId)
    !id && TelegramMsg("TECH", `Не вказане значення Країни Розетка. №${product.id}_${option.id}`)
    let paramArray = id ? [{
        '#': name, 
        '@name': 'Країна-виробник товару', '@paramid': "98900", '@valueid': `${id}`
    }, {
        '#': name, 
        '@name': 'Країна реєстрації бренда', '@paramid': "87790", '@valueid': `${brandId}`
    }] : [];

    if (product.product_categories.some(item => item.categoryId === 60)) {
        await ParfumeParam(option, product, paramArray)
    } else {
        await CosmeticsParam(option, product, paramArray)
    }

    price = Math.ceil(price / 5) * 5;

    return {
        offer: {
            '@id': `${product.id}_${option.id}`,
            '@available': option.count > 0 || option.sell_type === "preorder" || option.sell_type === "storage" ? "true" : "false",
            price: Math.ceil(price / 5) * 5,
            price_promo: option.marketPromoPrice ? option.marketPromoPrice: price,
            price_old: option.marketOldPrice?option.marketOldPrice:price,
            stock_quantity: option.count > 0 ? option.count : option.sell_type === "preorder" || option.sell_type === "storage" ? "5" : "0",
            currencyId: 'UAH',
            categoryId: categoryId,
            picture: await calculateImg(product, option),
            name: await calculateName(product, option, true, marketName),
            name_ua: await calculateName(product, option, false, marketName),
            vendor: product.brand.name
                .replaceAll("&", "&amp;")
                .replaceAll(`"`, "&quot;")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;"),
            description: {'$': product.disc_ru ? product.disc_ru.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1") : ""},
            description_ua: {'$': product.disc ? product.disc.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1") : ""},
            param: paramArray
        }
    }
}

module.exports = RozetkaXML;
