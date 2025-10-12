const epicenterParfumeNotes = require("./epicenterParfumeNotes");
const epicenterParfumeType = require("./epicenterParfumeType");

async function EpicenterParfumsParam(option, product, paramArray) {
    const categoryId = product.product_categories[0]?.categoryId;

    paramArray.push({
        '#': product.product_categories.some(item=>item.categoryId === 1) ? "для жінок"
            : product.product_categories.some(item=>item.categoryId === 2) ? "для чоловіків" : "унісекс",
            '@paramcode': '2856',
            '@name': 'Стать',
            '@valuecode': product.product_categories.some(item=>item.categoryId === 1) ? "0cf749c88d5437c547fe84a0a229aab3"
                : product.product_categories.some(item=>item.categoryId === 2) ? "2bad027d050f05de2f64a5154fadf2fd" : "215e95b3cfcd9253d58de048c203adc1"

    })
    paramArray.push({
        '#': product.product_categories.some(item=>item.categoryId === 93) ? "туалетна вода"
            : product.product_categories.some(item=>item.categoryId === 100) ? "парфум"
            : product.product_categories.some(item=>item.categoryId === 94) ? "одеколон"
                    : "парфумована вода",

            '@paramcode': '3013',
            '@name': 'Вид',
            '@valuecode': product.product_categories.some(item=>item.categoryId === 93) ? "4d85b6b7a6be8fb48e06d60037d70ba0"
                : product.product_categories.some(item=>item.categoryId === 100) ? "8af7335e0a479b6f8d26057b8f42c052"
                    : product.product_categories.some(item=>item.categoryId === 94) ? "97c09183e486588f74d7d6db65c1e977" : "509d6a6073558c8455a11222add4ba52"
    })
    paramArray.push({
        '#': option.weight,
            '@paramcode': '150', '@name': 'Вага'
    })
    paramArray.push({
        '#': 1,
            '@paramcode': '2847', '@name': 'Кількість в упаковці'
    })

    await epicenterParfumeNotes(product.filter_notes, paramArray)
    await epicenterParfumeType(product?.filter_types, paramArray)

    paramArray.push({
        '#': product.product_categories.some(item => item.categoryId === 91) ? "нішева" : "елітна",
            '@paramcode': '2346',
            '@name': 'Класифікація',
            '@valuecode': product.product_categories.some(item => item.categoryId === 91) ? "f8e496041026f2d59460dbc9785362e2" : "524e6c577e0c651f992c5c9dfd23f04f"
    })

}

module.exports = EpicenterParfumsParam;
