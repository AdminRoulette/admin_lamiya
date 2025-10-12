async function kastaEffect(effects,brushTypes, paramArray) {
    if (!effects) {
        return false;
    }
    let effectRes = "";

    for( const effect of effects ) {
        if (effect.id === 1014) {
            effectRes = "Матовий"
        }else if(effect.id === 1015) {
            effectRes = "Глянцевий"
        }else if(effect.id === 1019) {
            effectRes = "З шиммером"
        }
    }
    for( const brushType of brushTypes ) {
        if(brushType.id === 1026) {
            effectRes = "Об`єм"
        }else if(brushType.id === 1022) {
            effectRes = "Довжина"
        }else if(brushType.id === 1024) {
            effectRes = "Підкручування"
        }else if(brushType.id === 1025) {
            effectRes = "Водостійкий"
        }
    }

    if (effectRes) {
        paramArray.push({
            '#': effectRes,
            '@name': 'Ефект'
        })
    }
    return true;
}

module.exports = kastaEffect;
