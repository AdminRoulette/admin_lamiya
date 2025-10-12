async function calculateEcoTrends(features, paramArray) {
    if (!features) {
        return false;
    }

    let featuresArray = [];
    for(let feature of features) {
        if (feature.id === 158) {
            featuresArray.push({ name: "Веган-формула", code: "4328055" });
        }
        if (feature.id === 157) {
            featuresArray.push({ name: "Упаковка з вторинної сировини", code: "4262158" });
        }
        if (feature.id === 156) {
            featuresArray.push({ name: "Біорозкладна упаковка", code: "4259755" });
        }
        if (feature.id === 159) {
            featuresArray.push({ name: "Не тестувалася на тваринах", code: "4062273" });
        }
    }

    if (featuresArray.length > 0) {
        const names = featuresArray.map(item => item.name).join(',');
        const codes = featuresArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '249008', '@name': 'Екотренди', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateEcoTrends;
