async function promCreamTypes(purposes, paramArray) {
    if (!purposes) {
        return false;
    }

    let type = '';

    for(let purpose of purposes) {
        if (purpose.id === 61) {
            type = "Зволожуючий"
        } else if (purpose.id === 57) {
            type = "Живильний"
        } else if (purpose.id === 65) {
            type = "Матуючий"
        } else if (purpose.id === 985) {
            type = "Омолоджуючий"
        } else if (purpose.id === 90) {
            type = "Антицелюлітний"
        } else if (purpose.id === 92) {
            type = "Очищаючий"
        } else if (purpose.id === 72) {
            type = "Протизапальний"
        } else if (purpose.id === 49) {
            type = "Відбілюючий"
        } else if (purpose.id === 91) {
            type = "Освітлюючий"
        } else if (purpose.id === 86) {
            type = "Розгладжуючий"
        } else if (purpose.id === 75) {
            type = "Себорегулюючий"
        } else if (purpose.id === 50) {
            type = "Відновлюючий"
        }
    }

        if(type){
            paramArray.push({
                '#': type,
                '@name': 'Тип крему'
            })
        }

    return true;
}

module.exports = promCreamTypes;
