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
    if (product.product_categories.some(item => item.categoryId === 60)) {
        await PromParfumeParam(option, product, paramArray)
    } else {
        await PromCosmeticsParam(option, product, paramArray)
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
            categoryId: promCategoryId(product.product_categories[0]?.categoryId, option.sell_type === "on_tab"),
            price: price,
            price_old: price,
            stock_quantity: option.count > 0 ? option.count : option.sell_type === "preorder" || option.sell_type === "storage" ? "5" : "0",
            currencyId: 'UAH',
            picture: images,
            vendor: product.brand.name
                .replace("Collection Privee Paris", "Collection Privee")
                .replace("Ferragamo", "Salvatore Ferragamo")
                .replace("Dolce & Gabbana", "Dolce&Gabbana")
                .replace("Penhaligon's", "Penhaligon`s")
                .replace("Rabanne", "Paco Rabanne")
                .replace("Parfums de Rosine", "Les Parfums De Rosine")
                .replace("Initio Parfums", "Initio Parfums Prives")
                .replace("Goldfield & Banks Australia", "Goldfield & Banks")
                .replace("Gleam", "Gleam Perfume")
                .replace("Maison Martin Margiela", "Maison Margiela")
                .replace("Roja Parfums", "Roja")
                .replace("Mugler", "Thierry Mugler")
                .replace("Liquides Imaginaires", "Les Liquides Imaginaires")
                .replace("Gris Montaigne Paris", "Gris Montaigne")
                .replace("Hayari", "Hayari Parfums")
                .replace("Korloff Paris", "Korloff")
                .replace("Lorenzo Pazzaglia", "Pazzaglia")
                .replace("M. Micallef", "Martine Micallef")
                .replace("Alexandre.J", "Alexandre J")
                .replaceAll("&", "&amp;")
                .replaceAll(`"`, "&quot;")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;"),
            description: {'$': `${option.sell_type === "preorder" ? 'Некоторые аромати находятся на складе в Европе и доставляются в течение 4-7 дней\n\n' : ""}${product.disc_ru.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1")}`},
            description_ua: {'$': `${option.sell_type === "preorder" ? 'Деякі парфуми знаходиться на складі в Європі і доставляються протягом 4-7 днів\n\n': ""}${product.disc.replaceAll(/<a\b[^>]*>(.*?)<\/a>/gi, "$1")}`},
            country: country,
            gtin: option.gtin.toString(),
            keywords: (`${product.name_ru},${product.series_ru}`)
                .replaceAll("&", "&amp;")
                .replaceAll(`"`, "")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;"),
            keywords_ua: (`${product.name},${product.series}`)
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
