async function promSkinTypes(masks, paramArray) {
    if (!masks) {
        return false;
    }
    let typesArray = [];
    for( const mask of masks ) {
        if (mask.id === 990) {
            typesArray.push("Рідкі маски (маски-плівки)")
        }else if (mask.id === 991) {
            typesArray.push("Кремоподібні")
        }else if (mask.id === 992) {
            typesArray.push("Сухі")
        }else if (mask.id === 993) {
            typesArray.push("Гелевидні")
        }else if (mask.id === 994) {
            typesArray.push("Порошкоподібні")
        }else  if (mask.id === 995) {
            typesArray.push("Кисневі (бульбашкові)")
        }else  if (mask.id === 996) {
            typesArray.push("Гідрогелеві")
        }else  if (mask.id === 997) {
            typesArray.push("Тканинні")
        }else  if (mask.id === 998) {
            typesArray.push("Альгінатна")
        }
    }
    //singleselect
    if (typesArray.length > 0) {
        paramArray.push({
            '#': typesArray.join(" | "),
            '@name': 'Вид маски за призначенням'
        })
    }
    return true;



}

module.exports = promSkinTypes;
