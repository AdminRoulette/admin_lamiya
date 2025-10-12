async function SkinParam(skinList, paramArray) {
    let skinArray = [];
    let skinName = [];
    let skinCode = [];
    if (!skinList) {
        return false;
    }
    for (const skin of skinList) {
        skinArray.push(skin.skin_type.name)
    }

    if (skinArray.includes("Для всіх типів")) {
        skinName.push("для всіх типів")
        skinCode.push("6af90e9b4c4ee01e19a2a1bd8c89435e")
    } else if (skinArray.includes("Проблемна")) {
        skinName.push("для проблемної")
        skinCode.push("ce54bfa0e4130a50187aeccb124ecc4c")
    } else if (skinArray.includes("Чутлива")) {
        skinName.push("для чутливої")
        skinCode.push("18f23fb4b84c001c5707512718ee4e16")
    } else if (skinArray.includes("Комбінована")) {
        skinName.push("для комбінованої")
        skinCode.push("5b09afaf4c7f31ef593ccd1b3ba844f8")
    } else if (skinArray.includes("Нормальна")) {
        skinName.push("для нормальної")
        skinCode.push("16b122675a45e84b2ec6bc144f822bb2")
    } else if (skinArray.includes("Жирна")) {
        skinName.push("для жирної")
        skinCode.push("f05cd3a738e220b23ad656f09cf0c8d4")
    } else if (skinArray.includes("Суха")) {
        skinName.push("для сухої")
        skinCode.push("d69c04cd7ef46b266eae7d7fdf69f528")
    } else if (skinArray.includes("Зріла")) {
        skinName.push("для зрілої")
        skinCode.push("ba5811329ae72601566c74857a82b679")
    }
    paramArray.push({
        '#': skinName.toString(),
        '$': {
            paramcode: '2855',
            name: "Тип шкіри",
            valuecode: skinCode.toString()
        }
    })
    return true;
}

module.exports = SkinParam;
