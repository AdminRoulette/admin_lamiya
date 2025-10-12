async function kastaColor(colors, paramArray) {
    if (!colors) {
        return false;
    }
    let colorRes = "";
    for( const color of colors ) {
        if(color.id === 1056) {
            colorRes = "Сірий"
        }else if(color.id === 1081) {
            colorRes = "Синій"
        }else if(color.id === 1107) {
            colorRes = "Темно-бежевий"
        }else if(color.id === 1053) {
            colorRes = "Темно-коричневий"
        }else if(color.id === 1070) {
            colorRes = "Темно-рожевий"
        }else if(color.id === 1057) {
            colorRes = "Темно-сірий"
        }else if(color.id === 1058) {
            colorRes = "Фіолетовий"
        }else if(color.id === 1059) {
            colorRes = "Чорний"
        }else if(color.id === 1065) {
            colorRes = "Бежевий"
        }else if(color.id === 1067) {
            colorRes = "Білий"
        }else if(color.id === 1050) {
            colorRes = "Безбарвний"
        }else if(color.id === 1079) {
            colorRes = "Бірюзовий"
        }else if(color.id === 1076) {
            colorRes = "Бордовий"
        }else if(color.id === 1069) {
            colorRes = "Бронзовий"
        }else if(color.id === 1080) {
            colorRes = "Блакитний"
        }else if(color.id === 1074) {
            colorRes = "Жовтий"
        }else if(color.id === 1077) {
            colorRes = "Зелений"
        }else if(color.id === 1064) {
            colorRes = "Золотий"
        }else if(color.id === 1052) {
            colorRes = "Коричневий"
        }else if(color.id === 1063) {
            colorRes = "Червоний"
        }else if(color.id === 1066) {
            colorRes = "Малиновий"
        }else if(color.id === 1078) {
            colorRes = "Оливковий"
        }else if(color.id === 1075) {
            colorRes = "Помаранчевий"
        }else if(color.id === 1073) {
            colorRes = "Персиковий"
        }else if(color.id === 1054) {
            colorRes = "Рожевий"
        }else if(color.id === 1051) {
            colorRes = "Світло-коричневий"
        }else if(color.id === 1071) {
            colorRes = "Світло-рожевий"
        }else if(color.id === 1055) {
            colorRes = "Світло-сірий"
        }else if(color.id === 1062) {
            colorRes = "Сріблястий"
        }else if(color.id === 1064) {
            colorRes = "Золотистий"
        }else if(color.id === 1072) {
            colorRes = "Світло-бежевий"
        }else if(color.id === 1062) {
            colorRes = "Срібний"
        }
    }

    if (colorRes) {
        paramArray.push({
            '#': colorRes,
            '@name': 'Колір'
        })
    }
    return true;
}

module.exports = kastaColor;
