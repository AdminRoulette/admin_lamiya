async function promColorTypes(types, paramArray) {
    if (!types) {
        return false;
    }

    let type = '';

    for(let typeItem of types) {
        if (typeItem.id === 1014) {
            type = "Матовий"
        } else if (typeItem.id === 1015) {
            type = "Глянцевий"
        } else if (typeItem.id === 1016) {
            type = "Атласний"
        } else if (typeItem.id === 1017) {
            type = "Перламутровий"
        } else if (typeItem.id === 1018) {
            type = "Лаковий"
        } else if (typeItem.id === 1019) {
            type = "Шиммерний"
        }
    }
        if(type){
            paramArray.push({
                '#': type,
                '@name': 'Тип відтінку та кольору'
            })
        }

    return true;
}

module.exports = promColorTypes;
