const epicenterCategory4 = require("./categoryParams/epicenterCategory4");
const PurpousParam = require("./categoryParams/components/PurpousParam");
const SkinParam = require("./categoryParams/components/SkinParam");


async function EpicenterCosmeticsParam(option, product, paramArray) {
    const categoryId = product.product_categories[0].categoryId;
    // await PurpousParam(product.filter_purpose, paramArray)
    // await SkinParam(product.filter_skin, paramArray)
    paramArray.push({
        '#': "для жінок,унісекс",
        '@paramcode': '2856',
        '@name': 'Стать',
        '@valuecode': "0cf749c88d5437c547fe84a0a229aab3,215e95b3cfcd9253d58de048c203adc1"
    })

    if (categoryId === 29 || categoryId === 54 || categoryId === 55) {
        paramArray.push({
            '#': Number(option.weight),
            '@paramcode': '2847',
            '@name': "Кількість в упаковці",
        })
    }

    if (product.company === "hillary") {
        paramArray.push({
            '#': "Мідл-маркет (середня),Натуральна (біо),Професійна",
            '@paramcode': '9502',
            '@name': "Клас косметики",
            '@valuecode': "9880dfc0a622d122a4a6d1f13dfad447,df421b5bf069cf4c908c5f7065ae259b,5181ccd3255eccc2a5ac77eee6f8bd7b",
        })
        paramArray.push({
            '#': "не тестується на тваринах",
            '@paramcode': '228',
            '@name': "Особливості",
            '@valuecode': "6lx6gnixiiw68t86",
        })
    } else if (product.company === "korea") {
        paramArray.push({
            '#': "Мідл-маркет (середня),Професійна",
            '@paramcode': '9502',
            '@name': "Клас косметики",
            '@valuecode': "df421b5bf069cf4c908c5f7065ae259b,5181ccd3255eccc2a5ac77eee6f8bd7b",
        })
    }

    paramArray.push({
        '#': `${product.bodycarepart?.composition.substring(0, 254) ?
            product.bodycarepart.composition.substring(0, 254)
                .replaceAll(`"`, "&quot;")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;")
                .replaceAll("&", "&amp;") : ""}`,
        '@paramcode': '9502',
        '@name': "Склад"
    })
    paramArray.push({
        '#': `${product.bodycarepart?.applicationmethod ?
            product.bodycarepart.applicationmethod.replaceAll(`"`, "&quot;")
                .replaceAll(">", "&gt;")
                .replaceAll("<", "&lt;")
                .replaceAll(`'`, "&apos;")
                .replaceAll("&", "&amp;") : ""}`,
        '@name': "Спосіб застосування"
    })
    if (product.product_categories[0]?.category) {
        if (categoryId === 1 || categoryId === 3) {
            epicenterCategory4(paramArray, product.product_categories[0]?.categoryId)
        }
    }

}

module.exports = EpicenterCosmeticsParam;
