async function promApplicator(types, paramArray) {
    if (!types) {
        return false;
    }

    let type = '';

    for(let typeItem of types) {
        if (typeItem.id === 1038) {
            type = "Жорсткий пензлик"
        } else if (typeItem.id === 1037) {
            type = "М'яка щіточка"
        } else if (typeItem.id === 1036) {
            type = "Пензлик"
        } else if (typeItem.id === 1035) {
            type = "Фломастероподібний"
        }
    }
        if(type){
            paramArray.push({
                '#': type,
                '@name': 'Тип аплікатора'
            })
        }

    return true;
}

module.exports = promApplicator;
