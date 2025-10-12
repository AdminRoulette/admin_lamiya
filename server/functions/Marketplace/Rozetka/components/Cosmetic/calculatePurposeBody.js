async function calculatePurposeBody(purposes, paramArray) {
    if (!purposes) {
        return false;
    }

    let purposesArray = [];
    for(const purpose of purposes) {
        if (purpose.id === 76) {
            purposesArray.push({ name: "Тонізуюче", code: "2357930" });
        }
        if (purpose.id === 68) {
            purposesArray.push({ name: "Антибактеріальне", code: "2357942" });
        }
        if (purpose.id === 61) {
            purposesArray.push({ name: "Зволожувальна", code: "2357912" });
        }
        if (purpose.id === 1020) {
            purposesArray.push({ name: "Поживна", code: "2357918" });
        }
        if (purpose.id === 49) {
            purposesArray.push({ name: "Відбілювальне", code: "2378929" });
        }
        if (purpose.id === 48) {
            purposesArray.push({ name: "Проти чорних цяток", code: "2722906" });
        }
        if (purpose.id === 90) {
            purposesArray.push({ name: "Проти целюліту", code: "2357906" });
        }
        if (purpose.id === 94) {
            purposesArray.push({ name: "Пом'якшувальна", code: "2358020" });
        }
        if (purpose.id === 55) {
            purposesArray.push({ name: "Масажна", code: "2357990" });
        }
        if (purpose.id === 53) {
            purposesArray.push({ name: "Для сяйва", code: "3658006" });
        }
        if (purpose.id === 982) {
            purposesArray.push({ name: "Проти розтяжок", code: "2358008" });
        }
        if (purpose.id === 1086) {
            purposesArray.push({ name: "Моделювання фігури", code: "2722815" });
        }
    }


    if (purposesArray.length > 0) {
        const names = purposesArray.map(item => item.name).join(',');
        const codes = purposesArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '201554', '@name': 'Призначення', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculatePurposeBody;
