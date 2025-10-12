async function promEyelinerColors(colors, paramArray) {
    if (!colors) {
        return false;
    }
    let colorsArray= [];
    for( const colorItem of colors ) {
        if (colorItem.id === 1067) {
            colorsArray.push("Білий")
        }else if (colorItem.id === 1065) {
            colorsArray.push("Бежевий")
        }else if (colorItem.id === 1072) {
            colorsArray.push("Бежевий і його відтінки")
        }else if (colorItem.id === 1073) {
            colorsArray.push("Персиковий")
        }else if (colorItem.id === 1074) {
            colorsArray.push("Жовтий")
        }else if (colorItem.id === 1064) {
            colorsArray.push("Золотистий")
        }else if (colorItem.id === 1075) {
            colorsArray.push("Помаранчевий")
        }else if (colorItem.id === 1054) {
            colorsArray.push("Рожевий")
        }else if (colorItem.id === 1066) {
            colorsArray.push("Малиновий")
        }else if (colorItem.id === 1063) {
            colorsArray.push("Червоний")
        }else if (colorItem.id === 1076) {
            colorsArray.push("Бордовий")
        }else if (colorItem.id === 1077) {
            colorsArray.push("Зелений")
        }else if (colorItem.id === 1078) {
            colorsArray.push("Оливковий")
        }else if (colorItem.id === 1079) {
            colorsArray.push("Бірюзовий")
        }else if (colorItem.id === 1080) {
            colorsArray.push("Блакитний")
        }else if (colorItem.id === 1081) {
            colorsArray.push("Синій")
        }else if (colorItem.id === 1058) {
            colorsArray.push("Фіолетовий")
        }else if (colorItem.id === 1052) {
            colorsArray.push("Коричневий")
        }else if (colorItem.id === 1051 || colorItem.id === 1053) {
            colorsArray.push("Коричневий і його відтінки")
        }else if (colorItem.id === 1055) {
            colorsArray.push("Світло-сірий")
        }else if (colorItem.id === 1056) {
            colorsArray.push("Сірий")
        }else if (colorItem.id === 1057) {
            colorsArray.push("Темно-сірий")
        }else if (colorItem.id === 1059) {
            colorsArray.push("Чорний")
        }
    }

    if (colorsArray.length > 0) {
        paramArray.push({
            '#': colorsArray.join(" | "),
            '@name': 'Колір'
        })
    }

    return true;
}

module.exports = promEyelinerColors;
