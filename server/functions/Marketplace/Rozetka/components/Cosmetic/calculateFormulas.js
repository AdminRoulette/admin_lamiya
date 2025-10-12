async function calculateFormulas(formulas, paramArray) {
    if (!formulas) {
        return false;
    }
    let formulasArray = [];
    for( const formula of formulas ) {
        if (formula.id === 119) {
            formulasArray.push({name: "Гліцерин", code: "2266514"})
        }
        if (formula.id === 118) {
            formulasArray.push({name: "Вітамін Е", code: "2266466"})
        }
        if (formula.id === 117) {
            formulasArray.push({name: "Ретинол", code: "2266490"})
        }
        if (formula.id === 116) {
            formulasArray.push({name: "Пантенол", code: "2266508"})
        }
        if (formula.id === 134) {
            formulasArray.push({name: "Гіалуронова кислота", code: "2266454"})
        }
        if (formula.id === 133) {
            formulasArray.push({name: "Ніацинамід", code: "3610196"})
        }if (formula.id === 132) {
            formulasArray.push({name: "Вітамін С", code: "2266502"})
        }
        if (formula.id === 131) {
            formulasArray.push({name: "Пептиди", code: "2449998"})
        }
    }
    
    
    //200732	Інгредієнти	ListValues	main	N/D	4358526	Проксилан
    // 200732	Інгредієнти	ListValues	main	N/D	2266520	Саліцилова кислота
    // 200732	Інгредієнти	ListValues	main	N/D	2379829	Сечовина
    // 200732	Інгредієнти	ListValues	main	N/D	2413980	Цинк
    // 200732	Інгредієнти	ListValues	main	N/D	3630061	Гліколева кислота
    // 200732	Інгредієнти	ListValues	main	N/D	4358529	Поліфеноли
    // 200732	Інгредієнти	ListValues	main	N/D	4358532	Нейросенсин

    if (formulasArray.length > 0) {
        const names = formulasArray.map(item => item.name).join(',');
        const codes = formulasArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '200732', '@name': 'Інгредієнти', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateFormulas;
