async function calculateFeaturesHair(features, paramArray) {
    if (!features) {
        return false;
    }

    let featuresArray = [];
    for( const feature of features ) {
        if (feature.id === 148) {
            featuresArray.push({ name: "Термозахист для волосся", code: "2430657" });
        }else if (feature.id === 138) {
            featuresArray.push({ name: "Гіпоалергенні", code: "3392443" });
        }else if (feature.id === 153) {
            featuresArray.push({ name: "Без запаху", code: "3743291" });
        }else if (feature.id === 143) {
            featuresArray.push({ name: "Незмивні", code: "2430639" });
        }else if (feature.id === 147) {
            featuresArray.push({ name: "Двофазні", code: "2430711" });
        }
    }
    
    if (featuresArray.length > 0) {
        const names = featuresArray.map(item => item.name).join(',');
        const codes = featuresArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '203019', '@name': 'Особливості', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateFeaturesHair;
