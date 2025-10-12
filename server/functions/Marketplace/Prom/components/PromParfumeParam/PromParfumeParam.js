
async function PromParfumeParam(option, product, paramArray) {
    paramArray.push({
        '#': "оригінал",
        '@name': 'Оригінальність'
    })

    paramArray.push({
        '#': option.weight,
        '@name': 'Об`єм',
        '@unit': 'мл'
    })

    paramArray.push({
        '#': product.product_categories.some(item => item.categoryId === 91) ?"Нішева" : "Елітна",
        '@name': 'Класифікація'
    })

    if(option.sell_type === "on_tab"){
        paramArray.push({
            '#': product.product_categories.some(item => item.categoryId === 102) ?"Унісекс"
                : product.product_categories.some(item => item.categoryId === 103) ? "Чоловіча": "Жіноча",
            '@name': 'Стать'
        })

        paramArray.push({
            '#': option.weight,
            '@name': "Об'єм на розпив",
            '@unit': 'мл'
        })
    }

    const isTester = option.optionName.includes("Тестер");
    paramArray.push({
        '#': option.sell_type === "on_tab" ? "Мініатюра" : product.product_categories.some(item => item.categoryId === 93) ? isTester ? "Тестер - Туалетна вода" : "Туалетна вода"
            : product.product_categories.some(item => item.categoryId === 100) ? isTester ? "Тестер - Парфуми" : "Парфуми"
                : product.product_categories.some(item => item.categoryId === 94) ? isTester ? "Тестер - Одеколон" : "Одеколон"
                    :  isTester ? "Тестер - Парфумована вода" : "Парфумована вода",
        '@name': "Вид парфумерної продукції",
    })
    paramArray.push({
        '#': product?.filters?.parfume?.map(item => item.name).join(" | "),
        '@name': "Тип аромату"
    })

    paramArray.push({
        '#': product?.filters?.note?.map(item => item.name).join(" | "),
        '@name': "Початкова нота"
    })
}

module.exports = PromParfumeParam;
