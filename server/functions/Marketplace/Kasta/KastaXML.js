const TelegramMsg = require("../../TelegramMsg");
const calculateImg = require("../Rozetka/components/calculateImg");
const calculateName = require("../Rozetka/components/calculateName");
const KastaParfumeParam = require("./components/KastaParfumeParam");
const kastaCategoryId = require("./components/kastaCategoryId");
const kastaCosmeticParam = require("./components/kastaCosmeticParam");
const kastaCountry = require("./components/kastaCountry");

async function KastaXML(option, product) {
    const categoryId = await kastaCategoryId(product.product_categories);
    let price = option.price;

    if(!categoryId){
        // TelegramMsg("TECH", `KastaXML не внесена категорія ${product.id}`)
        return {}
    }
    const countryName = await kastaCountry(product?.filters?.["kraina-vyrobnyk"]?.[0])
    // !countryName && TelegramMsg("TECH", `Не вказане значення Країни Kasta. №${product.id}_${option.id}`)
    let paramArray = [{
        '#': countryName,
        '@name': 'Країна виробництва',
    },{
        '#': option.gtin,
        '@name': 'Штрих-код',
    }];

    // if (product.product_categories.some(item => item.categoryId === 60)) {
    //     await KastaParfumeParam(option, product, paramArray)
    // } else {
    //     await kastaCosmeticParam(option, product, paramArray)
    // }

    function getMultiplierFromId(id) {
        const step = id % 11;
        return 1.10 + step * 0.01; // 1.10 … 1.20
    }
    const multiplierPrice = Math.ceil(price * getMultiplierFromId(option.id) / 5) * 5;

    return {
        offer: {
            '@id': `${product.id}_${option.id}`,
            '@available': option.count > 0 || option.sell_type === "storage" ? "true" : "false",
            price: price,
            price_promo: option.marketPromoPrice ? option.marketPromoPrice : price,
            price_old: option.marketOldPrice ? option.marketOldPrice : multiplierPrice,
            stock_quantity: option.count > 0 ? option.count : option.sell_type === "storage" ? "10" : "0",
            currencyId: 'UAH',
            categoryId: categoryId,
            picture: await calculateImg(product, option),
            name_ru: (await calculateName(product, option, true, categoryId === "52" || categoryId === "64")).replaceAll("-", " "),
            name_ua:(await calculateName(product, option, false, categoryId === "52" || categoryId === "64")).replaceAll("-", " "),
            vendor: product.brand.name
                .replaceAll("&", "&amp;")
                .replaceAll(`"`, "&quot;")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;"),
            description: {'$': `${product.disc_ru.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1")}`},
            description_ua: {'$': `${product.disc.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1")}`},
            param: paramArray
        }
    }
}

module.exports = KastaXML;
