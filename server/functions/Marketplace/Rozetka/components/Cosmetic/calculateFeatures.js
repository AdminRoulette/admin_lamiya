async function calculateFeatures(features, paramArray, spf) {
    if (!features) {
        return false;
    }

    let featuresArray = [];
    if (spf) {
        featuresArray.push({name: "З SPF", code: "2266190"});
    }
    for(const feature of features) {
        if (feature.id === 147) {
            featuresArray.push({name: "Двофазний", code: "2266088"});
        }
        if (feature.id === 153) {
            featuresArray.push({name: "Без запаху", code: "2266100"});
        }
        if (feature.id === 138) {
            featuresArray.push({name: "Гіпоалергенна", code: "2266106"});
        }
    }


    if (featuresArray.length > 0) {
        const names = featuresArray.map(item => item.name).join(',');
        const codes = featuresArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '200696', '@name': 'Особливості', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateFeatures;
