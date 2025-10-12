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

    if (option.marketPrice > 0) {
        if (option.marketPrice > 6000) {
            price = option.marketPrice * 0.9
        } else if (option.marketPrice > 4000) {
            price = option.marketPrice * 0.94
        } else if (option.marketPrice > 1400) {
            price = option.marketPrice * 0.97
        } else {
            price = option.marketPrice
        }
    }

    if(product.product_categories.some(item => item.categoryId === 60)){
        price = Math.ceil((price * 1.05) / 5) * 5;
    }else{
        price = Math.ceil(price / 5) * 5;
    }



    const countryName = await kastaCountry(product.countryId)
    !countryName && TelegramMsg("TECH", `Не вказане значення Країни Kasta. №${product.id}_${option.id}`)
    let paramArray = [{
        '#': countryName,
        '@name': 'Країна виробництва',
    },{
        '#': option.gtin,
        '@name': 'Штрих-код',
    }];

    if (product.product_categories.some(item => item.categoryId === 60)) {
        await KastaParfumeParam(option, product, paramArray)
    } else {
        await kastaCosmeticParam(option, product, paramArray)
    }

    function getMultiplierFromId(id) {
        const step = id % 11;
        return 1.10 + step * 0.01; // 1.10 … 1.20
    }
    const multiplierPrice = Math.ceil(price * getMultiplierFromId(option.id) / 5) * 5;

    return {
        offer: {
            '@id': `${product.id}_${option.id}`,
            '@available': option.count > 0 || option.sell_type === "preorder" || option.sell_type === "storage" ? "true" : "false",
            price: price,
            price_promo: option.marketPromoPrice ? option.marketPromoPrice : price,
            price_old: option.marketOldPrice ? option.marketOldPrice : multiplierPrice,
            stock_quantity: option.count > 0 ? option.count : option.sell_type === "preorder" || option.sell_type === "storage" ? "10" : "0",
            currencyId: 'UAH',
            categoryId: categoryId,
            picture: await calculateImg(product, option),
            name: (await calculateName(product, option, true)).replaceAll("-", " ").replace(/d['’]hermes/gi, 'dHermes'),
            name_ua:(await calculateName(product, option, false)).replaceAll("-", " ").replace(/d['’]hermes/gi, 'dHermes'),
            vendor: product.brand.name
                .replace("Liquides Imaginaires", "Les Liquides Imaginaires")
                .replace("Kajal", "Kajal Perfumes")
                .replace("Medi Peel", "Medi-Peel")
                .replace("Gritti", "Dr. Gritti")
                .replace("Alexandre.J", "Alexandre J")
                .replace("Hayari", "Hayari Parfums")
                .replace("Benetton", "United Colors of Benetton")
                .replace("Parfums de Rosine", "Les Parfums de Rosine")
                .replaceAll("&", "&amp;")
                .replaceAll(`"`, "&quot;")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;"),
            description: {'$': `${option.sell_type === "preorder" ? 'Некоторые аромати находятся на складе в Европе и доставляются в течение 4-7 дней. ': ""}${product.disc_ru.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1")}`},
            description_ua: {'$': `${option.sell_type === "preorder" ? 'Деякі парфуми знаходиться на складі в Європі і доставляються протягом 4-7 днів. ': ""}${product.disc.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1")}`},
            param: paramArray
        }
    }
}

module.exports = KastaXML;
