async function promEffect(purposes, paramArray) {
    if (!purposes) {
        return false;
    }
    let effectArray = [];

for(let purpose of purposes) {

    if (purpose.id === 69) {
        effectArray.push("Відлущуючий")
    }
    if (purpose.id === 86) {
        effectArray.push("Розгладжуючий")
    }
    if (purpose.id === 94) {
        effectArray.push("Пом'якшувальна")
    }
    if (purpose.id === 92) {
        effectArray.push("Очищаючий")
    }
    if (purpose.id === 91) {
        effectArray.push("Освітлюючий")
    }
    if (purpose.id === 68) {
        effectArray.push("Антибактеріальне")
    }
    if (purpose.id === 65) {
        effectArray.push("Антиоксидантне")
    }
    if (purpose.id === 66) {
        effectArray.push("Освіжаюче")
    }
    if (purpose.id === 65) {
        effectArray.push("Матуючий")
    }
    if (purpose.id === 63) {
        effectArray.push("Зміцнювальну")
    }
    if (purpose.id === 61) {
        effectArray.push("Зволожуюче")
    }
    if (purpose.id === 58) {
        effectArray.push("Заспокійлива")
    }
    if (purpose.id === 57) {
        effectArray.push("Живильний")
    }
    if (purpose.id === 55) {
        effectArray.push("Масажне")
    }
    if (purpose.id === 50) {
        effectArray.push("Відновлюючий")
    }
    if (purpose.id === 49) {
        effectArray.push("Відбілююче")
    }
    if (purpose.id === 985) {
        effectArray.push("Омолоджуючу")
    }
    if (purpose.id === 90) {
        effectArray.push("Антицелюлітне")
    }
    if (purpose.id === 985) {
        effectArray.push("Омолоджуючу")
    }
    if (purpose.id === 58) {
        effectArray.push("Заспокійлива")
    }
    if (purpose.id === 83) {
        effectArray.push("Регенеруюча")
    }
    if (purpose.id === 82) {
        effectArray.push("Протинабрякове")
    }
    if (purpose.id === 85) {
        effectArray.push("Охолоджувальне")
    }
    if (purpose.id === 72) {
        effectArray.push("Протизапальне")
    }
    if (purpose.id === 76) {
        effectArray.push("Тонізуючу")
    }
    if (purpose.id === 75) {
        effectArray.push("Себорегулююче")
    }
}

    if (effectArray.length > 0) {
        paramArray.push({
            '#': effectArray.join(" | "),
            '@name': 'Дія'
        })
     }
    return true;
}

module.exports = promEffect;
