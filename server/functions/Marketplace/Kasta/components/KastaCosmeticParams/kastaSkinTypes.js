async function kastaSkinTypes(skins, paramArray) {
    if (!skins) {
        return false;
    }
    let skinsArray = [];
    for( const skin of skins ) {
        if (skin.id === 99) {
            skinsArray.push("Нормальна")
        } if (skin.id === 97) {
            skinsArray.push("Суха")
        } if (skin.id === 98) {
            skinsArray.push("Жирна")
        } if (skin.id === 100) {
            skinsArray.push("Комбінована")
        } if (skin.id === 101) {
            skinsArray.push("Чутлива")
        } if (skin.id === 102) {
            skinsArray.push("Проблемна")
        }if (skin.id === 103) {
            skinsArray.push("Усі типи")
        }
    }

    if (skinsArray.length > 0) {
        paramArray.push({
            '#': skinsArray.join(","),
            '@name': 'Тип'
        })
    }
    return true;
}

module.exports = kastaSkinTypes;
