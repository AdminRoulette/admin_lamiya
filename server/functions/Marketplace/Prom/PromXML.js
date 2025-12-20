const promCategoryId = require("./components/promCategoryId");
const calculateImg = require("../Rozetka/components/calculateImg");
const calculatePromName = require("./components/calculatePromName");
const PromParfumeParam = require("./components/PromParfumeParam/PromParfumeParam");
const PromCosmeticsParam = require("./components/PromCosmeticsParam/PromCosmeticsParam");
const calculatePromCountry = require("./components/calculatePromCountry");

async function PromXML(option, product) {
    let stock = option.count > 0 || option.sell_type === "preorder" || option.sell_type === "storage" ? "true" : "false"
    let price = option.marketPrice > 0 ? option.marketPrice : option.price;
    const isParfume = product.product_categories.some(item => item.categoryId === 60)

    let images = [];
    for (const image of await calculateImg(product, option)) {
        images.push(image);
    }
    let country = await calculatePromCountry(product.countryId)
    let paramArray = [];
    if (product.product_categories.some(item => item.categoryId === 61 || item.categoryId === 62 || item.categoryId === 52 || item.categoryId === 64)) {

        paramArray.push({
            '#': option.name,
            '@name': product.product_categories.some(item => item.categoryId === 61) ? 'Колір браслета/ремінця' : 'Колір '
        })

       // await PromParfumeParam(option, product, paramArray)
    }else if (product.product_categories.some(item => item.categoryId === 63)) {

        paramArray.push({
            '#': "Прозорий",
            '@name': 'Колір'
        })
    }

    return {
        offer: {
            '@id': `${product.id}_${option.id}`,
            '@available': stock,
            '@in_stock': stock,
            '@selling_type': 'r',
            article:`${product.id}_${option.id}`,
            name: calculatePromName(product, option, true, isParfume),
            name_ua: calculatePromName(product, option, false, isParfume),
            categoryId: promCategoryId(product.product_categories[0]?.categoryId),
            price: price,
            price_old: price,
            stock_quantity: option.count > 0 ? option.count : option.sell_type === "preorder" || option.sell_type === "storage" ? "5" : "0",
            currencyId: 'UAH',
            picture: images,
            vendor: product.brand.name
                .replaceAll("&", "&amp;")
                .replaceAll(`"`, "&quot;")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;"),
            description: {'$': `${product.disc_ru.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1")}`},
            description_ua: {'$': `${product.disc.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1")}`},
            country: country,
            gtin: option.gtin.toString(),
            keywords: product.tags
                .replaceAll("&", "&amp;")
                .replaceAll(`"`, "")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;"),
            keywords_ua: product.tags_ru
                .replaceAll("&", "&amp;")
                .replaceAll(`"`, "")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;"),
            param: paramArray
        }
    }

}

module.exports = PromXML;
