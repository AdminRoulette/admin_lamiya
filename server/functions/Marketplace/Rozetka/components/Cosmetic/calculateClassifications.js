async function calculateClassifications(classifications, paramArray) {
    if (!classifications) {
        return false;
    }
    let classification = {};
    for( const classificationItem of classifications ) {
        if (classificationItem.id === 1) {
            classification = {name: "Дерматокосметика", code: "4262182"}
        }else if (classificationItem.id === 2) {
            classification = {name: "Люкс", code: "151197"}
        }else
        if (classificationItem.id === 3) {
            classification = {name: "Професійна", code: "149212"}
        }else
        if (classificationItem.id === 4) {
            classification = {name: "Натуральна", code: "158787"}
        }else
        // if (classificationItem.id === 5) {
        //     classification = {name: "Нішева", code: ""}
        // }
        if (classificationItem.id === 6) {
            classification = {name: "Мас-маркет", code: "206890"}
        }else
        if (classificationItem.id === 7) {
            classification = {name: "Мідл-маркет", code: "149207"}
        }
    }

    if (classification) {
        paramArray.push({
            '#': classification.name,
                '@paramid': '56277', '@name': 'Клас косметики', '@valueid': classification.code
        })
    }
    return true;
}

module.exports = calculateClassifications;
