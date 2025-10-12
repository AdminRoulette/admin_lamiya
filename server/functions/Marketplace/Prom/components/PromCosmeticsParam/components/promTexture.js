async function promTexture(textures, paramArray) {
    if (!textures) {
        return false;
    }

    let texture = '';

    for (let purpose of textures) {
        if (purpose.id === 1013) {
            texture = "Тверда"
        } else if (purpose.id === 1012) {
            texture = "Двофазна"
        } else if (purpose.id === 170) {
            texture = "Рідка"
        } else if (purpose.id === 172) {
            texture = "Кремоподібна"
        } else if (purpose.id === 171) {
            texture = "Гелеподібна"
        }
    }

    if (texture) {
        paramArray.push({
            '#': texture,
            '@name': 'Консистенція засобу'
        })
    }

    return true;
}

module.exports = promTexture;
