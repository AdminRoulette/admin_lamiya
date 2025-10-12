async function promBlushTypes(types, paramArray) {
    if (!types) {
        return false;
    }

    let type = '';

    for(let typeItem of types) {
        if (typeItem.id === 169) {
            type = "Сухі"
        } else if (typeItem.id === 172) {
            type = "Кремові"
        } else if (typeItem.id === 171) {
            type = "Гелеві"
        } else if (typeItem.id === 170) {
            type = "Рідкі"
        } else if (typeItem.id === 1030) {
            type = "Запечені"
        }
    }
        if(type){
            paramArray.push({
                '#': type,
                '@name': "Тип рум'ян"
            })
        }

    return true;
}

module.exports = promBlushTypes;
