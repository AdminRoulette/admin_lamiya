async function promAdditionalEffect(purposes, paramArray) {
    if (!purposes) {
        return false;
    }
    let purposesArray = [];
    for( const purpose of purposes ) {
        if (purpose.id === 61) {
            purposesArray.push("Зволоження")
        }
        if (purpose.id === 57) {
            purposesArray.push("Живлення")
        }
        if (purpose.id === 58) {
            purposesArray.push("Заспокоєння")
        }
        if (purpose.id === 94) {
            purposesArray.push("Пом'якшення")
        }
        if (purpose.id === 86) {
            purposesArray.push("Розгладження")
        }
        if (purpose.id === 50) {
            purposesArray.push("Відновлення")
        }
        if (purpose.id === 72) {
            purposesArray.push("Зняття запалення")
        }
        if (purpose.id === 69) {
            purposesArray.push("Відлущування")
        }
        if (purpose.id === 65) {
            purposesArray.push("Матування")
        }
        if (purpose.id === 91) {
            purposesArray.push("Освітлення")
        }
        if (purpose.id === 985) {
            purposesArray.push("Омолодження")
        }
        if (purpose.id === 986) {
            purposesArray.push("Ефект вологих губ")
        }
        if (purpose.id === 987) {
            purposesArray.push("Збільшення об'єму губ")
        }
        if (purpose.id === 988) {
            purposesArray.push("Вирівнювання тону обличчя")
        }
        if (purpose.id === 86) {
            purposesArray.push("Омолодження")
        }

    }

    if (purposesArray.length > 0) {
        paramArray.push({
            '#': purposesArray.join(" | "),
            '@name': 'Додатковий ефект'
        })
    }
    return true;
}

module.exports = promAdditionalEffect;
