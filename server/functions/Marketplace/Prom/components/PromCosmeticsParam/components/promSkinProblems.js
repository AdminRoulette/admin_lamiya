async function promSkinProblems(purposes, paramArray) {
    if (!purposes) {
        return false;
    }
    let purposesArray = [];

    for (const purpose of purposes) {
        if (purpose.id === 69) {
            purposesArray.push("Лущення");
        }
        if (purpose.id === 73) {
            purposesArray.push("Пігментація");
        }
        if (purpose.id === 72) {
            purposesArray.push("Запалення");
        }
        if (purpose.id === 71) {
            purposesArray.push("Акне");
        }
        if (purpose.id === 48) {
            purposesArray.push("Чорні крапки");
        }
        if (purpose.id === 47) {
            purposesArray.push("Темні кола");
        }
        if (purpose.id === 46) {
            purposesArray.push("Почервоніння");
        }
        if (purpose.id === 89) {
            purposesArray.push("Зморшки");
        }
        if (purpose.id === 45) {
            purposesArray.push("Купероз");
        }
        if (purpose.id === 82) {
            purposesArray.push("Набряклість");
        }
    }

    if (purposesArray.length > 0) {
        paramArray.push({
            '#': purposesArray.join(" | "),
            '@name': 'Проблема шкіри'
        })
    }
    return true;
}

module.exports = promSkinProblems;
