async function calculatePurposeHair(purposes, paramArray) {
    if (!purposes) {
        return false;
    }

    let purposesArray = [];
    for(const purpose of purposes) {
        if (purpose.id === 79) {
            purposesArray.push({ name: "Від лупи", code: "2439477" });
        }
        if (purpose.id === 50) {
            purposesArray.push({ name: "Для відновлення волосся", code: "2439495" });
        }
        if (purpose.id === 60) {
            purposesArray.push({ name: "Для захисту волосся", code: "2439579" });
        }
        if (purpose.id === 88) {
            purposesArray.push({ name: "Від випадіння волосся", code: "2439483" });
        }
        if (purpose.id === 96) {
            purposesArray.push({ name: "Для об'єму волосся", code: "2439489" });
        }
        if (purpose.id === 78) {
            purposesArray.push({ name: "Для випрямлення волосся", code: "2439567" });
        }
        if (purpose.id === 53) {
            purposesArray.push({ name: "Для блиску волосся", code: "2439507" });
        }
        if (purpose.id === 61) {
            purposesArray.push({ name: "Для зволоження волосся", code: "2439531" });
        }
        if (purpose.id === 81) {
            purposesArray.push({ name: "Для легкого розчісування", code: "2439561" });
        }
        if (purpose.id === 86) {
            purposesArray.push({ name: "Для розгладження волосся", code: "2439555" });
        }
        if (purpose.id === 63) {
            purposesArray.push({ name: "Для зміцнення волосся", code: "2439501" });
        }
        if (purpose.id === 57) {
            purposesArray.push({ name: "Для живлення волосся", code: "2439543" });
        }
        if (purpose.id === 94) {
            purposesArray.push({ name: "Для пом'якшення волосся", code: "2667885" });
        }
        if (purpose.id === 56) {
            purposesArray.push({ name: "Для росту волосся", code: "2439519" });
        }
        if (purpose.id === 999) {
            purposesArray.push({ name: "Для щоденного застосування", code: "2439525" });
        }
        if (purpose.id === 1087) {
            purposesArray.push({ name: "Для укладання волосся", code: "2439549" });
        }
        if (purpose.id === 1088) {
            purposesArray.push({ name: "Для кінчиків волосся", code: "2439513" });
        }
    }


    if (purposesArray.length > 0) {
        const names = purposesArray.map(item => item.name).join(',');
        const codes = purposesArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '203373', '@name': 'Призначення', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculatePurposeHair;
