async function promSkinProblemsAndStatus(skin_problems,skins, paramArray) {
    if (!skin_problems || !skins) {
        return false;
    }
    let skin_problemsArray = [];
    for (const skin of skins) {
        if (skin.id === 97) {
            skin_problemsArray.push("Сухість");
        }
        if (skin.id === 101) {
            skin_problemsArray.push("Чутливість");
        }
    }

    for (const skin_problem of skin_problems) {
        if (skin_problem.id === 69) {
            skin_problemsArray.push("Лущення");
        }
        if (skin_problem.id === 81) {
            skin_problemsArray.push("Для розчісування волосся");
        }
        if (skin_problem.id === 71) {
            skin_problemsArray.push("Акне");
        }
        if (skin_problem.id === 87) {
            skin_problemsArray.push("Роздратування");
        }
        if (skin_problem.id === 70) {
            skin_problemsArray.push("Світловідображення");
        }
        if (skin_problem.id === 82) {
            skin_problemsArray.push("Набряклість");
        }
        if (skin_problem.id === 90) {
            skin_problemsArray.push("Целюліт");
        }
        if (skin_problem.id === 982) {
            skin_problemsArray.push("Розтяжки");
        }
        if (skin_problem.id === 73) {
            skin_problemsArray.push("Пігментація");
        }
        if (skin_problem.id === 95) {
            skin_problemsArray.push("Вікові зміни");
        }
        if (skin_problem.id === 89) {
            skin_problemsArray.push("Зморшки");
        }
        if (skin_problem.id === 71) {
            skin_problemsArray.push("Акне");
        }
        if (skin_problem.id === 71) {
            skin_problemsArray.push("Акне");
        }
        if (skin_problem.id === 983) {
            skin_problemsArray.push("Втрата пружності");
        }
        if (skin_problem.id === 984) {
            skin_problemsArray.push("Опіки");
        }
    }

    if (skin_problemsArray.length > 0) {
        paramArray.push({
            '#': skin_problemsArray.join(" | "),
            '@name': 'Проблема і стан шкіри'
        })
    }
    return true;
}

module.exports = promSkinProblemsAndStatus;
