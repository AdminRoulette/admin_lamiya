async function promTon(colors, paramArray) {
    if (!colors) {
        return false;
    }
    let color = "";
    for( const colorItem of colors ) {
        if (colorItem.id === 1050) {
            color = "Прозорий"
        }else if (colorItem.id === 1065) {
            color = "Бежевый"
        }else if (colorItem.id === 1054) {
            color = "Рожевий"
        }else if (colorItem.id === 1064) {
            color = "Золотистий"
        }else if (colorItem.id === 1051) {
            color = "Коричневий світлий"
        }else if (colorItem.id === 1052) {
            color = "Коричневий"
        }else if (colorItem.id === 1053) {
            color = "Коричневий темний"
        }else if (colorItem.id === 1066) {
            color = "Малиновий"
        }else if (colorItem.id === 1069) {
            color = "Бронзовий"
        }else if (colorItem.id === 1072) {
            color = "Бежевий світлий"
        }else if (colorItem.id === 1071) {
            color = "Рожевий світлий"
        }else if (colorItem.id === 1070) {
            color = "Рожевий темний"
        }else if (colorItem.id === 1068) {
            color = "Слонова кістка"
        }else if (colorItem.id === 1067) {
            color = "Білий"
        }
    }

    if (color) {
        paramArray.push({
            '#': color,
            '@name': 'Тон'
        })
    }

    return true;
}

module.exports = promTon;
