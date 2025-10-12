async function KastaParfumeParam(option, product, paramArray) {
    const categoryId = product.product_categories[0].categoryId;
    // paramArray.push({
    //     '#': product.year,
    //         '@name': "Рік початку випуску",
    // })

    paramArray.push({
        '#': Number(option.weight),
        '@name': "Об'єм"
    })

    paramArray.push({
        '#': categoryId === 106 ? "Подарунковий набір" :option.optionName.includes("Тестер") ? "Тестер" : option.optionName.includes("Тестер") ? "Змінний блок" : "Флакон",
        '@name': 'Тара/упаковка',
    })

    paramArray.push({
        '#': product?.filters?.note?.map(n => n.name).join(','),
        '@name': 'Аромат верхні ноти'
    })

    paramArray.push({
        '#': product?.filters?.parfume?.map(n => n.name).join(','),
        '@name': 'Ароматизація'
    })
}

module.exports = KastaParfumeParam;
