async function calculateHairTypes(skin_types, paramArray) {
    if (!skin_types) {
        return false;
    }
    let skinTypesArray = [];
    for(const skin of skin_types) {
        if (skin.id === 106) {
            skinTypesArray.push({name: "Всі типи волосся", code: "2424990"})
        }
        if (skin.id === 110) {
            skinTypesArray.push({name: "Неслухняне волосся", code: "4048913"})
        }
        if (skin.id === 107) {
            skinTypesArray.push({name: "Жирне волосся", code: "2425008"})
        }
        if (skin.id === 113) {
            skinTypesArray.push({name: "Фарбоване волосся", code: "2425020"})
        }
        if (skin.id === 114) {
            skinTypesArray.push({name: "Пошкоджене волосся", code: "2425026"})
        }
        if (skin.id === 109) {
            skinTypesArray.push({name: "Нормальне волосся", code: "2425014"})
        }
        if (skin.id === 115) {
            skinTypesArray.push({name: "Сухе волосся", code: "2425032"})
        }
        if (skin.id === 112) {
            skinTypesArray.push({name: "Тонке волосся", code: "2425050"})
        }
        if (skin.id === 105) {
            skinTypesArray.push({name: "Кучеряве волосся", code: "2425002"})
        }
    }

    if (skinTypesArray.length > 0) {
        const names = skinTypesArray.map(item => item.name).join(',');
        const codes = skinTypesArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '202788', '@name': 'Тип волосся', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateHairTypes;
