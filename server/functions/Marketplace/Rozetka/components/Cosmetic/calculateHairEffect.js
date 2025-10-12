async function calculateHairEffect(purposes, paramArray) {
    if (!purposes) {
        return false;
    }

    let purposesArray = [];
    for(const purpose of purposes) {
        if (purpose.id === 95) {
            purposesArray.push({name: "Антивіковий догляд", code: "2427471"});
        }
        if (purpose.id === 60) {
            purposesArray.push({name: "Захист кольору", code: "2427549"});
        }
        if (purpose.id === 77) {
            purposesArray.push({name: "Тонує", code: "2427579"});
        }
        if (purpose.id === 76) {
            purposesArray.push({name: "Тонізує шкіру голови", code: "2427615"});
        }
        if (purpose.id === 58) {
            purposesArray.push({name: "Заспокоює", code: "2444208"});
        }
        if (purpose.id === 66) {
            purposesArray.push({name: "Освіжає", code: "2616628"});
        }
        if (purpose.id === 50) {
            purposesArray.push({name: "Оновлює", code: "2616634"});
        }
        if (purpose.id === 983) {
            purposesArray.push({name: "Підвищує пружність", code: "2616784"});
        }
        if (purpose.id === 50) {
            purposesArray.push({name: "Відновлює", code: "2616622"});
        }
        if (purpose.id === 57) {
            purposesArray.push({name: "Живить", code: "2427537"});
        }
        if (purpose.id === 53) {
            purposesArray.push({name: "Надає сяйво", code: "4120813"});
        }
        if (purpose.id === 81) {
            purposesArray.push({name: "Полегшує розчісування", code: "2427567"});
        }
        if (purpose.id === 56) {
            purposesArray.push({name: "Прискорює ріст волосся", code: "2427525"});
        }
        if (purpose.id === 1082) {
            purposesArray.push({name: "Формує локони", code: "2427465"});
        }
        if (purpose.id === 1083) {
            purposesArray.push({name: "Активізує волосяні цибулини", code: "2427531"});
        }
        if (purpose.id === 1084) {
            purposesArray.push({name: "Нормалізує жировий баланс", code: "2427621"});
        }
        if (purpose.id === 94) {
            purposesArray.push({name: "Надає м'якість", code: "2427609"});
        }
    }
    


    if (purposesArray.length > 0) {
        const names = purposesArray.map(item => item.name).join(',');
        const codes = purposesArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '203001', '@name': 'Дія', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateHairEffect;
