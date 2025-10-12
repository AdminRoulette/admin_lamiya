async function promShampooTypes(shampoos, paramArray) {
    if (!shampoos) {
        return false;
    }
    let typesArray = [];
    for( const shampoo of shampoos ) {
        if (shampoo.id === 999) {
            typesArray.push("Для щоденного використання")
        }else
        if (shampoo.id === 1000) {
            typesArray.push("Сухий шампунь")
        }else
        if (shampoo.id === 1001) {
            typesArray.push("Для фарбованого волосся")
        }else
        if (shampoo.id === 1002) {
            typesArray.push("Для пошкодженого волосся")
        }else
        if (shampoo.id === 61) {
            typesArray.push("Зволожуючий")
        }
    }

    if (typesArray.length > 0) {
        paramArray.push({
            '#': typesArray.join(" | "),
            '@name': 'Тип шампуню'
        })
    }
    return true;
}

module.exports = promShampooTypes;
