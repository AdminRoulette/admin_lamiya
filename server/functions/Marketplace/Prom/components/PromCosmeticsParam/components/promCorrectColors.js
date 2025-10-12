async function promCorrectColors(colors, paramArray) {
    if (!colors) {
        return false;
    }
    let colorsArray = [];
    for (const colorItem of colors) {
        if (colorItem.id === 1067) {
            colorsArray.push("Білий")
        }
        if (colorItem.id === 1065) {
            colorsArray.push("Бежевий")
        }
        if (colorItem.id === 1072) {
            colorsArray.push("Бежевий світлий")
        }
        if (colorItem.id === 1073) {
            colorsArray.push("Персиковий")
        }
        if (colorItem.id === 1074) {
            colorsArray.push("Жовтий")
        }
        if (colorItem.id === 1064) {
            colorsArray.push("Золотистий")
        }
        if (colorItem.id === 1075) {
            colorsArray.push("Помаранчевий")
        }
        if (colorItem.id === 1054) {
            colorsArray.push("Рожевий")
        }
        if (colorItem.id === 1066) {
            colorsArray.push("Малиновий")
        }
        if (colorItem.id === 1063) {
            colorsArray.push("Червоний")
        }
        if (colorItem.id === 1076) {
            colorsArray.push("Бордовий")
        }
        if (colorItem.id === 1077) {
            colorsArray.push("Зелений")
        }
        if (colorItem.id === 1078) {
            colorsArray.push("Оливковий")
        }
        if (colorItem.id === 1079) {
            colorsArray.push("Бірюзовий")
        }
        if (colorItem.id === 1080) {
            colorsArray.push("Блакитний")
        }
        if (colorItem.id === 1081) {
            colorsArray.push("Синій")
        }
        if (colorItem.id === 1058) {
            colorsArray.push("Фіолетовий")
        }
        if (colorItem.id === 1052) {
            colorsArray.push("Коричневий")
        }
        if (colorItem.id === 1053) {
            colorsArray.push("Коричневий темний")
        }
        if (colorItem.id === 1051) {
            colorsArray.push("Коричневий світлий")
        }
        if (colorItem.id === 1056) {
            colorsArray.push("Сірий")
        }

        if (colorItem.id === 1059) {
            colorsArray.push("Чорний")
        }
        if (colorItem.id === 1068) {
            colorsArray.push("Слонова кістка")
        }
        if (colorItem.id === 1059) {
            colorsArray.push("Чорний")
        }
    }


    if (colorsArray.length > 0) {
        paramArray.push({
            '#': colorsArray.join(" | "),
            '@name': 'Цвет маскирующего средства'
        })
    }

    return true;
}

module.exports = promCorrectColors;
