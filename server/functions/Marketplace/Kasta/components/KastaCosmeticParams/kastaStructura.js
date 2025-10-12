async function kastaStructura(structures, paramArray) {
    if (!structures) {
        return false;
    }
    let structureRes = "";
    for( const structure of structures ) {
        if (structure.id === 1013) {
            structureRes = "Тверда"
        }else if(structure.id === 1030) {
            structureRes = "Запечена"
        }else if(structure.id === 1097) {
            structureRes = "Розсипчаста"
        }else if(structure.id === 172 || structure.id === 171) {
            structureRes = "Кремоподібна"
        }else if(structure.id === 171) {
            structureRes = "Гелева"
        }else if(structure.id === 170) {
            structureRes = "Рідка"
        }
    }

    if (structureRes) {
        paramArray.push({
            '#': structureRes,
            '@name': 'Структура'
        })
    }
    return true;
}

module.exports = kastaStructura;
