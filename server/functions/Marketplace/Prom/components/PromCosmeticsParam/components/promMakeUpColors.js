async function promMakeUpColors(colors, paramArray) {
    if (!colors) {
        return false;
    }
    let color = "";
    for( const colorItem of colors ) {
        if (colorItem.id === 1050) {
            color = "Безбарвний"
        }else if (colorItem.id === 1051) {
            color = "Світло-коричневий"
        }else if (colorItem.id === 1052) {
            color = "Коричневий"
        }else if (colorItem.id === 1053) {
            color = "Темно-коричневий"
        }else if (colorItem.id === 1054) {
            color = "Рожевий"
        }else if (colorItem.id === 1055) {
            color = "Світло-сірий"
        }else if (colorItem.id === 1056) {
            color = "Сірий"
        }else if (colorItem.id === 1057) {
            color = "Темно-сірий"
        }else if (colorItem.id === 1058) {
            color = "Фіолетовий"
        }else if (colorItem.id === 1059) {
            color = "Чорний"
        }else if (colorItem.id === 1060) {
            color = "Пудровий"
        }else if (colorItem.id === 1061) {
            color = "Сіро-коричневий"
        }
    }

     if (color) {
        paramArray.push({
            '#': color,
            '@name': 'Колір/Відтінок'
        })
     }
    return true;
}

module.exports = promMakeUpColors;
