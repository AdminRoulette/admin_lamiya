async function promEyelinerTypes(types, paramArray) {
    if (!types) {
        return false;
    }

    let type = '';

    for(let typeItem of types) {
        if (typeItem.id === 1039) {
            type = "Кремова"
        } else if (typeItem.id === 1041) {
            type = "Рідка"
        } else if (typeItem.id === 1042) {
            type = "Фломастер"
        } else if (typeItem.id === 1043) {
            type = "Компактна"
        } else if (typeItem.id === 1040) {
            type = "Гелева"
        }
    }
        if(type){
            paramArray.push({
                '#': type,
                '@name': 'Тип підводки'
            })
        }

    return true;
}

module.exports = promEyelinerTypes;
