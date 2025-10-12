async function promFormulas(formulas, paramArray) {
    if (!formulas) {
        return false;
    }
    let formulasArray = [];
    for( const purpose of formulas ) {
        if (purpose.id === 121) {
            formulasArray.push("Колаген")
        }
        if (purpose.id === 118 || purpose.id === 132) {
            formulasArray.push("Вітаміни")
        }
        if (purpose.id === 117) {
            formulasArray.push("Ретинол")
        }
        if (purpose.id === 134) {
            formulasArray.push("Гіалуронова кислота")
        }
        if (purpose.id === 133) {
            formulasArray.push("Ніацинамід")
        }
        if (purpose.id === 131) {
            formulasArray.push("Пептиди")
        }
        if (purpose.id === 122) {
            formulasArray.push("Кераміди")
        }
        if (purpose.id === 123) {
            formulasArray.push("Пребіотик")
        }
        if (purpose.id === 135) {
            formulasArray.push("Бакучіол")
        }

    }

     if (formulasArray.length > 0) {
        paramArray.push({
            '#': formulasArray.join(" | "),
            '@name': 'Основні інгредієнти'
        })
     }
    return true;
}

module.exports = promFormulas;
