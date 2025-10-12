async function promBrushTypes(types, paramArray) {
    if (!types) {
        return false;
    }

    let type = '';

    for(let typeItem of types) {
        if (typeItem.id === 1022) {
            type = "Подовжуюча"
        } else if (typeItem.id === 1023) {
            type = "Розділяюча"
        } else if (typeItem.id === 1024) {
            type = "Підкручуюча"
        } else if (typeItem.id === 1025) {
            type = "Водостійка"
        } else if (typeItem.id === 1026) {
            type = "Об'ємна"
        } else if (typeItem.id === 1027) {
            type = "Ефект накладних вій"
        }
    }
        if(type){
            paramArray.push({
                '#': type,
                '@name': 'Тип туші'
            })
        }

    return true;
}

module.exports = promBrushTypes;
