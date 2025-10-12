async function promPurposes(purposes, paramArray) {
    if (!purposes) {
        return false;
    }
    let purposesArray = [];
    for( const purpose of purposesArray ) {
        if (purpose.id === 69) {
            purposesArray.push('Відлущуюча');
        }
        if (purpose.id === 79) {
            purposesArray.push('Від лупи');
        }
        if (purpose.id === 78) {
            purposesArray.push('Випрямлення');
        }
        if (purpose.id === 77) {
            purposesArray.push('Тонування');
        }
        if (purpose.id === 76) {
            purposesArray.push('Тонізація');
        }
        if (purpose.id === 86) {
            purposesArray.push('Розгладження');
        }
        if (purpose.id === 73) {
            purposesArray.push('Зменшення пігментації шкіри');
        }
        if (purpose.id === 72) {
            purposesArray.push('Зняття запалення');
        }
        if (purpose.id === 94) {
            purposesArray.push("Пом'якшення");
        }
        if (purpose.id === 92) {
            purposesArray.push('Очищення');
        }
        if (purpose.id === 91) {
            purposesArray.push('Освітлення');
        }
        if (purpose.id === 68) {
            purposesArray.push('Антибактеріальне');
        }
        if (purpose.id === 67) {
            purposesArray.push('Антиоксидант');
        }
        if (purpose.id === 65) {
            purposesArray.push('Матування');
        }
        if (purpose.id === 64) {
            purposesArray.push('Ліфтинг');
        }
        if (purpose.id === 63) {
            purposesArray.push('Зміцнення');
        }
        if (purpose.id === 62) {
            purposesArray.push('Звуження пор');
        }
        if (purpose.id === 61) {
            purposesArray.push('Зволоження');
        }
        if (purpose.id === 59) {
            purposesArray.push('Захист від УФ-променів');
        }
        if (purpose.id === 58) {
            purposesArray.push('Заспокоєння');
        }
        if (purpose.id === 57) {
            purposesArray.push('Живлення');
        }
        if (purpose.id === 96) {
            purposesArray.push("Об'єм");
        }
        if (purpose.id === 53) {
            purposesArray.push('Блиск');
        }
        if (purpose.id === 50) {
            purposesArray.push('Відновлення');
        }
        if (purpose.id === 49) {
            purposesArray.push('Відбілювання');
        }
        if (purpose.id === 95) {
            purposesArray.push('Антивіковий');
        }
        if (purpose.id === 88) {
            purposesArray.push('Від випадіння');
        }
        if (purpose.id === 44) {
            purposesArray.push('Від перших ознак старіння');
        }
        if (purpose.id === 85) {
            purposesArray.push('Охолодження');
        }
        if (purpose.id === 84) {
            purposesArray.push('Нормалізація кислотно-лужного балансу');
        }
        if (purpose.id === 83) {
            purposesArray.push('Регенерація');
        }
        if (purpose.id === 82) {
            purposesArray.push('Зняття набряків');
        }

    }


     if (purposesArray.length > 0) {
        paramArray.push({
            '#': purposesArray.join(" | "),
            '@name': 'Призначення і результат'
        })
     }
    return true;
}

module.exports = promPurposes;
