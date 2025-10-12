async function calculateSkinTypes(skin_types, paramArray) {
    if (!skin_types) {
        return false;
    }
    let skinTypesArray = [];
    for(const skin of skin_types) {
        if (skin.id === 103) {
            skinTypesArray.push({name: "Для всіх типів", code: "2286794"})
        }
        if (skin.id === 102) {
            skinTypesArray.push({name: "Проблемна", code: "2286824"})
        }
        if (skin.id === 101) {
            skinTypesArray.push({name: "Чутлива", code: "2286800"})
        }
        if (skin.id === 100) {
            skinTypesArray.push({name: "Комбінована", code: "2286782"})
        }
        if (skin.id === 99) {
            skinTypesArray.push({name: "Нормальна", code: "2286776"})
        }
        if (skin.id === 98) {
            skinTypesArray.push({name: "Жирна", code: "2286788"})
        }
        if (skin.id === 97) {
            skinTypesArray.push({name: "Суха", code: "2286770"})
        }
    }
    

    if (skinTypesArray.length > 0) {
        const names = skinTypesArray.map(item => item.name).join(',');
        const codes = skinTypesArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '200942', '@name': 'Тип шкіри', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateSkinTypes;
