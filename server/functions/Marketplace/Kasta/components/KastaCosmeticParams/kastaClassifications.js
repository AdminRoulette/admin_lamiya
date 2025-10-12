async function kastaClassifications(classifications, paramArray) {
    if (!classifications) {
        return false;
    }
    let classificationsArray = [];
    for( const classification of classifications) {
        if (classification.id === 1) {
            classificationsArray.push("Лікувальна")
        }else
        if (classification.id === 2) {
            classificationsArray.push("Люкс")
        }else
        if (classification.id === 3) {
            classificationsArray.push("Професійна")
        }else
        if (classification.id === 4) {
            classificationsArray.push("Натуральна")
        }else
        if (classification.id === 5) {
            classificationsArray.push("Нішева")
        }else
        if (classification.id === 6) {
            classificationsArray.push("Мас Маркет")
        }else
        if (classification.id === 7) {
            classificationsArray.push("Мідл Маркет")
        }

    }

    if (classificationsArray.length > 0) {
        paramArray.push({
            '#': classificationsArray.join(","),
            '@name': 'Класифікація'
        })
    }
    return true;
}

module.exports = kastaClassifications;
