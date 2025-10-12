async function promShadowsTypes(types, paramArray) {
    if (!types) {
        return false;
    }

    let type = '';

    for(let typeItem of types) {
        if (typeItem.id === 1028) {
            type = "Компактні"
        } else if (typeItem.id === 1029) {
            type = "Розсипчасті"
        } else if (typeItem.id === 1030) {
            type = "Запечені"
        } else if (typeItem.id === 1031) {
            type = "Крем-тіні"
        } else if (typeItem.id === 1032) {
            type = "Рідкі"
        } else if (typeItem.id === 1033) {
            type = "Тіні-олівець"
        } else if (typeItem.id === 1034) {
            type = "Пресовані"
        }

    }
        if(type){
            paramArray.push({
                '#': type,
                '@name': 'Тип тіней'
            })
        }

    return true;
}

module.exports = promShadowsTypes;
