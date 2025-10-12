async function calculateColors(colors, paramArray) {
    if (!colors) {
        return false;
    }
    let colorsArray = [];
    for( const color of colors ) {

        // if (color.id === 0) {
        //     colorsArray.push({ name: "Тілесний", code: "4677767" });
        // }
        // if (color.id === 3034683) {
        //     colorsArray.push({ name: "Нюдовий", code: "3034683" });
        // }
        if (color.id === 1064) {
            colorsArray.push({ name: "Золотий", code: "3316921" });
        }
        if (color.id === 1054) {
            colorsArray.push({ name: "Рожевий", code: "3034606" });
        }
        if (color.id === 1063) {
            colorsArray.push({ name: "Червоний", code: "3034613" });
        }
        if (color.id === 1077) {
            colorsArray.push({ name: "Зелений", code: "3034620" });
        }
        if (color.id === 1081) {
            colorsArray.push({ name: "Синій", code: "3034627" });
        }
        if (color.id === 1074) {
            colorsArray.push({ name: "Жовтий", code: "3034641" });
        }
        if (color.id === 1056) {
            colorsArray.push({ name: "Сірий", code: "3034669" });
        }
        if (color.id === 1067) {
            colorsArray.push({ name: "Білий", code: "3034676" });
        }
        if (color.id === 1062) {
            colorsArray.push({ name: "Сріблястий", code: "3034697" });
        }
        if (color.id === 1065) {
            colorsArray.push({ name: "Бежевий", code: "3198889" });
        }
        if (color.id === 1071) {
            colorsArray.push({ name: "Світло-рожевий", code: "3214519" });
        }
        if (color.id === 1070) {
            colorsArray.push({ name: "Темно-рожевий", code: "3214525" });
        }
        if (color.id === 1080) {
            colorsArray.push({ name: "Блакитний", code: "3214891" });
        }
        if (color.id === 1066) {
            colorsArray.push({ name: "Малиновий", code: "3236695" });
        }
        if (color.id === 1073) {
            colorsArray.push({ name: "Персиковий", code: "3236749" });
        }
        if (color.id === 1058) {
            colorsArray.push({ name: "Фіолетовий", code: "3034634" });
        }
        if (color.id === 1051) {
            colorsArray.push({ name: "Світло-коричневий", code: "3279703" });
        }
        if (color.id === 1053) {
            colorsArray.push({ name: "Темно-коричневий", code: "3279709" });
        }
        if (color.id === 1057) {
            colorsArray.push({ name: "Темно-сірий", code: "3279901" });
        }
    }

    if (colorsArray.length > 0) {
        const names = colorsArray.map(item => item.name).join(',');
        const codes = colorsArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '218464', '@name': 'Колір', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateColors;
