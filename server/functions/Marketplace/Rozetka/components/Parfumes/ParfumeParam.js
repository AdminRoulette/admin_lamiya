const calculateParfumeType = require("./calculateParfumeType");
const calculateParfumeSeason = require("./calculateParfumeSeason");
const calculateVolume = require("../Cosmetic/calculateVolume");

async function ParfumeParam(option, product, paramArray) {
    paramArray.push({
        '#': product.product_categories.some(item => item.categoryId === 93) ? "Туалетна вода"
            : product.product_categories.some(item => item.categoryId === 100) ? "Парфуми"
                : product.product_categories.some(item => item.categoryId === 94) ? "Одеколон"
                    : "Парфумована вода",
            '@paramid': '56752',
            '@name': 'Тип',
            '@valueid': product.product_categories.some(item => item.categoryId === 93) ? "151047"
                : product.product_categories.some(item => item.categoryId === 100) ? "509422"
                    : product.product_categories.some(item => item.categoryId === 94) ? "156662"
                        : "155877"
    })

    if(product.product_categories.some(item => item.categoryId === 106)) {
        paramArray.push({
            '#': "Парфумерний",
                '@paramid': '257807',
                '@name': "Вид подарункового набору",
                '@valueid': "4762898"
        })
    }

    // paramArray.push({
    //     '#': product.year,
    //         '@paramid': '207914',
    //         '@name': "Рік прем'єри аромату",
    //         '@valueid': await calculateParfumeYear(Number(product.year))
    // })

    // paramArray.push({
    //     '#': product.parfumer,
    //         '@paramid': '207998',
    //         '@name': "Парфумер"
    // })

    paramArray.push({
        '#': Number(option.weight),
            '@paramid': '199674',
            '@name': "Об'єм",
            '@valueid': await calculateVolume(Number(option.weight), product.id)
    })

    paramArray.push({
        '#': option.optionName.includes("Тестер") ? "Тестер" : option.optionName.includes("Тестер") ? "Змінний блок" : "Стандартний",
            '@paramid': '207902',
            '@name': 'Формат',
            '@valueid': option.optionName.includes("Тестер") ? "2526674" : option.optionName.includes("Тестер") ? "2526698" : "3701866",
    })

    paramArray.push({
        '@name': "Доставка/оплата",
        value: [
            {'#': "Деякі парфуми знаходиться на складі в Європі і доставляються протягом 4-7 днів", '@lang': "uk"},
            {'#': "Некоторые аромати находятся на складе в Европе и доставляются в течение 4-7 дней", '@lang': "ru"}
        ]
    })

    paramArray.push({
        '#': product?.filters?.note?.map(n => n.name_ru).join(', '),
        '@paramid': '56762',
        '@name': 'Ноти'
    })
    await calculateParfumeType(product?.filters?.parfume, paramArray)
    await calculateParfumeSeason(product.filters?.season, paramArray)
}

module.exports = ParfumeParam;
