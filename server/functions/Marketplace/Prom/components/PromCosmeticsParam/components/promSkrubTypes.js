async function promSkrubTypes(types, paramArray) {
    if (!types) {
        return false;
    }
    let typesArray = [];
    for( const type of types ) {
        if (type.id === 1005) {
            typesArray.push("Природні")
        }else if (type.id === 1006) {
            typesArray.push("Синтетичні")
        }else if (type.id === 1007) {
            typesArray.push("Великі")
        }else if (type.id === 1008) {
            typesArray.push("Середні")
        }else if (type.id === 1009) {
            typesArray.push("Дрібні")
        }else if (type.id === 1010) {
            typesArray.push("М'які")
        }else if (type.id === 1011) {
            typesArray.push("Тверді")
        }
    }
    
    if (typesArray.length > 0) {
        paramArray.push({
            '#': typesArray.join(" | "),
            '@name': 'Тип абразивних частинок'
        })
    }
    return true;
}

module.exports = promSkrubTypes;
