async function calculateTextures(textures, paramArray) {
    if (!textures) {
        return false;
    }
    let texturesArray = [];
    for(const texture of textures) {
        if (texture.id === 172) {
            texturesArray.push({name: "Кремова", code: "2846460"})
        }else if (texture.id === 171) {
            texturesArray.push({name: "Гелева", code: "2846439"})
        }else if (texture.id === 170) {
            texturesArray.push({name: "Рідка", code: "2846453"})
        }else if (texture.id === 169) {
            texturesArray.push({name: "Суха", code: "2846502"})
        }else if (texture.id === 168) {
            texturesArray.push({name: "Плівка", code: "2846481"})
        }else if (texture.id === 167) {
            texturesArray.push({name: "Пудрова", code: "4878209"})
        }
    }

    if (texturesArray.length > 0) {
        const names = texturesArray.map(item => item.name).join(',');
        const codes = texturesArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '216736', '@name': 'Текстура', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculateTextures;
