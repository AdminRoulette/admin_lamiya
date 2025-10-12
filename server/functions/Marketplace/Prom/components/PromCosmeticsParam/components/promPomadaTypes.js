async function promPomadaTypes(purposes,features, paramArray) {
    if (!purposes || !features) {
        return false;
    }

    let type = '';

    for(let typeItem of purposes) {
        if (typeItem.id === 61) {
            type = "Зволожуюча"
        } else if (typeItem.id === 1020) {
            type = "Поживна"
        }
    }
    for(let feature of features) {
        if (feature.id === 1021) {
            type = "Стійка"
        }
    }
        if(type){
            paramArray.push({
                '#': type,
                '@name': 'Тип помади'
            })
        }

    return true;
}

module.exports = promPomadaTypes;
