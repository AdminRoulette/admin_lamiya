async function kastaMaskTypes(types, paramArray) {
    if (!types) {
        return false;
    }
    let typeRes = "";
    for( const type of types ) {
        if (type.id === 990) {
            typeRes = "Плівкова"
        }else if(type.id === 991) {
            typeRes = "Кремоподібна"
        }else if(type.id === 993) {
            typeRes = "Рідкі"
        }else if(type.id === 994) {
            typeRes = "Порошкоподібна"
        }else if(type.id === 996) {
            typeRes = "Гелеподібна"
        }else if(type.id === 997) {
            typeRes = "Тканева"
        }
    }

    if (typeRes) {
        paramArray.push({
            '#': typeRes,
            '@name': 'Структура'
        })
    }
    return true;
}

module.exports = kastaMaskTypes;
