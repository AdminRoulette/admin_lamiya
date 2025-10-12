async function calculateparfume_type(types, paramArray) {
    if (!types) {
        return false;
    }
    let typesArray = [];
    for (let type of types) {
        if (type.id === 29) {
            typesArray.push({name: "Квітковий", code: "151117"})
        }
        if (type.id === 30) {
            typesArray.push({name: "Фруктовий", code: "151122"})
        }
        if (type.id === 31) {
            typesArray.push({name: "Свіжий", code: "1148303"})
        }
        if (type.id === 19) {
            typesArray.push({name: "Пряний", code: "151132"})
        }
        if (type.id === 32) {
            typesArray.push({name: "Деревний", code: "151137"})
        }
        if (type.id === 33) {
            typesArray.push({name: "Шипровий", code: "155882"})
        }
        if (type.id === 34) {
            typesArray.push({name: "Фужерний", code: "155887"})
        }
        if (type.id === 35) {
            typesArray.push({name: "Східний", code: "155892"})
        }
        if (type.id === 36) {
            typesArray.push({name: "Теплий", code: "406328"})
        }
        if (type.id === 37) {
            typesArray.push({name: "Трав'янистий", code: "509065"})
        }
        if (type.id === 38) {
            typesArray.push({name: "Пудровий", code: "509072"})
        }
        if (type.id === 15) {
            typesArray.push({name: "Водний", code: "509079"})
        }
        if (type.id === 39) {
            typesArray.push({name: "Солодкий", code: "509086"})
        }
        if (type.id === 26) {
            typesArray.push({name: "Морський", code: "509093"})
        }
        if (type.id === 40) {
            typesArray.push({name: "Мускусний", code: "509100"})
        }
        if (type.id === 24) {
            typesArray.push({name: "Шкіряний", code: "629213"})
        }
        if (type.id === 23) {
            typesArray.push({name: "Тютюновий", code: "862440"})
        }
        if (type.id === 22) {
            typesArray.push({name: "Ванільний", code: "916879"})
        }
        if (type.id === 21) {
            typesArray.push({name: "Гурманський", code: "1056681"})
        }
        if (type.id === 20) {
            typesArray.push({name: "Цитрусовий", code: "1203543"})
        }
        if (type.id === 16) {
            typesArray.push({name: "Альдегідні", code: "1262320"})
        }
        if (type.id === 18) {
            typesArray.push({name: "Землистий", code: "151142"})
        }
        if (type.id === 17) {
            typesArray.push({name: "Смолистий", code: "1935864"})
        }
        if (type.id === 42) {
            typesArray.push({name: "Озоновий", code: "930910"})
        }
        if (type.id === 14) {
            typesArray.push({name: "Амбровий", code: "1851477"})
        }
        if (type.id === 25) {
            typesArray.push({name: "Кавовий", code: "2410272"})
        }
        if (type.id === 27) {
            typesArray.push({name: "Шоколадний", code: "2410362"})
        }
        if (type.id === 28) {
            typesArray.push({name: "Зелений", code: "2170485"})
        }
    }

    if (typesArray.length > 0) {
        const names = typesArray.map(item => item.name).join(',');
        const codes = typesArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names, '@paramid': '56757', '@name': 'Сімейство аромату', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateparfume_type;
