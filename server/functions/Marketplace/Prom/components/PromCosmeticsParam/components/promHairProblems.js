async function promHairProblems(hair_problems,hair, paramArray) {
    if (!hair_problems || !hair) {
        return false;
    }
    let hair_problemsArray = [];
    for( const hair_problem of hair_problems) {
        if (hair_problem.id === 79) {
            hair_problemsArray.push("Лупа")
        }
        if (hair_problem.id === 80) {
            hair_problemsArray.push("Посічені кінчики")
        }
        if (hair_problem.id === 88) {
            hair_problemsArray.push("Випадання волосся")
        }
        if (hair_problem.id === 46) {
            hair_problemsArray.push("Почервоніння шкіри голови")
        }
        if (hair_problem.id === 75) {
            hair_problemsArray.push("Себорея")
        }
        if (hair_problem.id === 60) {
            hair_problemsArray.push("Порушення кольору волосся")
        }


        if (hair.id === 108) {
            hair_problemsArray.push("Ламкість")
        }
        if (hair.id === 114) {
            hair_problemsArray.push("Ослаблені волосся")
        }
        if (hair.id === 112) {
            hair_problemsArray.push("Стоншене волосся")
        }
        if (hair.id === 60) {
            hair_problemsArray.push("Порушення кольору волосся")
        }
        if (hair.id === 60) {
            hair_problemsArray.push("Порушення кольору волосся")
        }
    }


    if (hair_problemsArray.length > 0) {
        paramArray.push({
            '#': hair_problemsArray.join(" | "),
            '@name': 'Проблема волосся і шкіри голови'
        })
    }
    return true;
}

module.exports = promHairProblems;
