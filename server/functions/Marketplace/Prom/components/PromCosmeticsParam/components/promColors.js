async function promColors(colors, paramArray) {
    if (!colors) {
        return false;
    }
    let color = "";
    for( const colorItem of colors ) {
        if (colorItem.id === 1050) {
            color = "Прозорий"
        }else if (colorItem.id === 1051 || colorItem.id === 1052 || colorItem.id === 1053 || colorItem.id === 1061) {
            color = "Коричневий і його відтінки"
        }else if (colorItem.id === 1054) {
            color = "Рожевий і його відтінки"
        }else if (colorItem.id === 1058) {
            color = "Фіолетовий"
        }else if (colorItem.id === 1062) {
            color = "Сріблястий"
        }else if (colorItem.id === 1063) {
            color = "Червоний і його відтінки"
        }else if (colorItem.id === 1064) {
            color = "Золотий"
        }else if (colorItem.id === 1065) {
            color = "Бежевий і його відтінки"
        }else if (colorItem.id === 1066) {
            color = "Малиновий"
        }
    }
//<attribute id="3392" nameRU="Цвет и оттенок средства для губ" type="singleselect" nameUK="Колір та відтінок засобу для губ">
// <attribute_value id="22805" nameRU="Коричневый и его оттенки" nameUK="Коричневий і його відтінки"/>
// <attribute_value id="22806" nameRU="Фиолетовый" nameUK="Фіолетовий"/>
// <attribute_value id="22807" nameRU="С блестками" nameUK="З блискітками"/>
// <attribute_value id="22808" nameRU="Серебристый" nameUK="Сріблястий"/>
// <attribute_value id="22809" nameRU="Красный и его оттенки" nameUK="Червоний і його відтінки"/>
// <attribute_value id="22810" nameRU="Золотой" nameUK="Золотий"/>
// <attribute_value id="22811" nameRU="Розовый и его оттенки" nameUK="Рожевий і його відтінки"/>
// <attribute_value id="22812" nameRU="Оранжевый и его оттенки" nameUK="Помаранчевий і його відтінки"/>
// <attribute_value id="22813" nameRU="Бежевый и его оттенки" nameUK="Бежевий і його відтінки"/>
// <attribute_value id="22814" nameRU="Бордовый" nameUK="Бордовий"/>
// <attribute_value id="22815" nameRU="Шоколад" nameUK="Шоколад"/>
// <attribute_value id="22816" nameRU="Сливовый" nameUK="Сливовий"/>
// <attribute_value id="22817" nameRU="Сиреневый и его оттенки" nameUK="Бузковий і його відтінки"/>
// <attribute_value id="22818" nameRU="Карамель" nameUK="Карамель"/>
// <attribute_value id="22819" nameRU="Малиновый" nameUK="Малиновий"/>
// <attribute_value id="22820" nameRU="Прозрачный" nameUK="Прозорий"/>
// <attribute_value id="22821" nameRU="Полупрозрачный" nameUK="Напівпрозорий"/>
// <attribute_value id="22822" nameRU="Вишнёвый" nameUK="Вишневий"/>
// <attribute_value id="70313" nameRU="Коралловый" nameUK="Кораловий"/>
// <attribute_value id="281733" nameRU="Зеленый" nameUK="Зелений"/>
// <attribute_value id="284962" nameRU="Фуксия" nameUK="Фуксія"/>
// <attribute_value id="293523" nameRU="Разные оттенки" nameUK="Різні відтінки"/>
// <attribute_value id="301278" nameRU="Черный" nameUK=""/>
// <attribute_value id="302718" nameRU="Нюд" nameUK=" Нюд"/>
// <attribute_value id="303475" nameRU="Серый" nameUK="Сірий"/>
// <attribute_value id="310681" nameRU="Белый" nameUK="Білий"/>
// <attribute_value id="315015" nameRU="Персиковый" nameUK="Персиковий"/>
// <attribute_value id="315100" nameRU="Абрикосовый" nameUK="Абрикосовий"/>
// </attribute>
    if (color) {
        paramArray.push({
            '#': color,
            '@name': 'Колір та відтінок засобу для губ'
        })
    }

    return true;
}

module.exports = promColors;
