async function calculateFeaturesBody(features, paramArray) {
    if (!features) {
        return false;
    }

    let featuresArray = [];
    for (const feature of features) {
        if (feature.id === 147) {
            featuresArray.push({name: "Двофазний", code: "2266088"});
        }
        if (feature.id === 144) {
            featuresArray.push({name: "З блискітками", code: "2357876"});
        }
        if (feature.id === 145) {
            featuresArray.push({name: "Парфумований", code: "2357870"});
        }
        if (feature.id === 146) {
            featuresArray.push({name: "Водостійкий", code: "2357840"});
        }
    }


    if (featuresArray.length > 0) {
        const names = featuresArray.map(item => item.name).join(',');
        const codes = featuresArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '201548', '@name': 'Особливості', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateFeaturesBody;
