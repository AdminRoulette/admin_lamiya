async function promHairPurposes(purposes, paramArray) {
    if (!purposes) {
        return false;
    }
    let purposesArray = [];
    for( const purpose of purposes ) {
        if (purpose.purpose === 50) {
            purposesArray.push("Відновлення")
        }
        if (purpose.purpose === 53) {
            purposesArray.push("Для блиску")
        }
        if (purpose.purpose === 96) {
            purposesArray.push("Для обсягу")
        }
        if (purpose.purpose === 88) {
            purposesArray.push("Від випадіння")
        }
        if (purpose.purpose === 79) {
            purposesArray.push("Від лупи")
        }
        if (purpose.purpose === 92) {
            purposesArray.push("Очищення")
        }
        if (purpose.purpose === 94) {
            purposesArray.push("Пом'якшення")
        }
        if (purpose.purpose === 61) {
            purposesArray.push("Зволоження")
        }
        if (purpose.purpose === 63) {
            purposesArray.push("Зміцнення")
        }
        if (purpose.purpose === 58) {
            purposesArray.push("Заспокоєння")
        }
        if (purpose.purpose === 81) {
            purposesArray.push("Легкість розчісування")
        }
        if (purpose.purpose === 80) {
            purposesArray.push("Розгладження посічених кінчиків")
        }
        if (purpose.purpose === 86) {
            purposesArray.push("Розгладження")
        }
        if (purpose.purpose === 56) {
            purposesArray.push("Поліпшення росту волосся")
        }
        if (purpose.purpose === 77) {
            purposesArray.push("Тонування")
        }
        if (purpose.purpose === 76) {
            purposesArray.push("Тонізація")
        }
        if (purpose.purpose === 95) {
            purposesArray.push("Антивіковий")
        }
        if (purpose.purpose === 57) {
            purposesArray.push("Живлення")
        }
        if (purpose.purpose === 91) {
            purposesArray.push("Освітлення")
        }
        if (purpose.purpose === 67) {
            purposesArray.push("Антиоксидант")
        }
        if (purpose.purpose === 68) {
            purposesArray.push("Антибактеріальне")
        }
        if (purpose.purpose === 72) {
            purposesArray.push("Протизапальне")
        }
    }

    if (purposesArray.length > 0) {
        paramArray.push({
            '#': purposesArray.join(" | "),
            '@name': 'Призначення засобу для волосся'
        })
    }
    return true;
}

module.exports = promHairPurposes;
