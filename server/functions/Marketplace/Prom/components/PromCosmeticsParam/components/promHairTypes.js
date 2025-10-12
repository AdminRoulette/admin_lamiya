async function promHairTypes(hairs, paramArray) {
    if (!hairs) {
        return false;
    }
    let hairTypeArray = [];
    for( const hair of hairs ) {
        if (hair.filter_id === 108) {
            hairTypeArray.push("Ламке")
        }
        if (hair.filter_id === 107) {
            hairTypeArray.push("Жирне")
        }
        if (hair.filter_id === 110) {
            hairTypeArray.push("Неслухняне")
        }
        if (hair.filter_id === 112) {
            hairTypeArray.push("Тонке")
        }
        if (hair.filter_id === 113) {
            hairTypeArray.push("Забарвлені")
        }
        if (hair.filter_id === 114) {
            hairTypeArray.push("Пошкоджені")
        }
        if (hair.filter_id === 115) {
            hairTypeArray.push("Сухі")
        }
        if (hair.filter_id === 106) {
            hairTypeArray.push("Всі типи волосся")
        }
        if (hair.filter_id === 105) {
            hairTypeArray.push("В'юнкі")
        }
        if (hair.filter_id === 109) {
            hairTypeArray.push("Натуральне")
        }
    }

    if (hairTypeArray.length > 0) {
        paramArray.push({
            '#': hairTypeArray.join(" | "),
            '@name': 'Тип волосся'
        })
    }
    return true;
}

module.exports = promHairTypes;
