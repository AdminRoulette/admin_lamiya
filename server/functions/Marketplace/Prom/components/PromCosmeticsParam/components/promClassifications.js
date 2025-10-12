async function promClassifications(classifications, paramArray) {
    if (!classifications) {
        return false;
    }
    let classificationsArray = [];
    for( const classification of classifications) {
        if (classification.id === 1) {
            classificationsArray.push("Лікувальна (Космецевтика)")
        }else
        if (classification.id === 2) {
            classificationsArray.push("Елітна")
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
            classificationsArray.push("Мас маркет")
        }else
        if (classification.id === 7) {
            classificationsArray.push("Мідл-маркет")
        }

    }

    if (classificationsArray.length > 0) {
        paramArray.push({
            '#': classificationsArray.join(" | "),
            '@name': 'Класифікація косметичного засобу'
        })
    }
    return true;
}

module.exports = promClassifications;
