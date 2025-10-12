async function PurpousParam(purpousList, paramArray) {
    let purpousArray = [];
    let purpousName = [];
    let purpousCode = [];
    if (!purpousList) {
        return false;
    }
    for (const purpose of purpousList) {
        purpousArray.push(purpose.purpose_type.name)
    }

    if (purpousArray.includes("Від перших ознак старіння")) {
        purpousName.push("проти старіння")
        purpousCode.push("6d04f443dc9ae3f1dd3620808f29682b")
    } else if (purpousArray.includes("Від зморшок")) {
        purpousName.push("проти зморшок")
        purpousCode.push("3c5217db7058f0107d98eddc5ee19afa")
    } else if (purpousArray.includes("Антицелюліт")) {
        purpousName.push("антицелюлітний")
        purpousCode.push("56701cc98e85ba2144ffc83aa5505832")
    } else if (purpousArray.includes("Антивіковий")) {
        purpousName.push("антивіковий")
        purpousCode.push("46d784657567e56005bcb38c88bc8a32")
    } else if (purpousArray.includes("Від почервонінь")) {
        purpousName.push("зменшення почервоніння")
        purpousCode.push("b9283f4891d5366c36e8898a6e58cc98")
    } else if (purpousArray.includes("Від темних кіл")) {
        purpousName.push("проти темних кіл")
        purpousCode.push("aba50ed934e99dc7544b231eff389f8b")
    } else if (purpousArray.includes("Відбілювання")) {
        purpousName.push("вибілювання")
        purpousCode.push("3b81862475a15e0ae5785d9125066967")
    } else if (purpousArray.includes("Відновлення")) {
        purpousName.push("відновлення гідробалансу")
        purpousCode.push("1294c6d5f24b39cd9722405361e2b368")
    } else if (purpousArray.includes("Для блиску")) {
        purpousName.push("для блиску")
        purpousCode.push("0be1dcc72e426d3434ae42b8e1cf6fdc")
    } else if (purpousArray.includes("Живлення")) {
        purpousName.push("живлення")
        purpousCode.push("7906f7d2af00d9472dbbd335f50777d6")
    } else if (purpousArray.includes("Заспокоєння")) {
        purpousName.push("заспокійливий")
        purpousCode.push("900772a48c61380d5510cf9346a69716")
    } else if (purpousArray.includes("Захист від сонця")) {
        purpousName.push("захист від сонця")
        purpousCode.push("136a5fc11dfc3576a6a571240119948d")
    } else if (purpousArray.includes("Зволоження")) {
        purpousName.push("зволоження")
        purpousCode.push("8a870d6d518360864888ecec8c8b0f3f")
    } else if (purpousArray.includes("Звуження пор")) {
        purpousName.push("звуження пор")
        purpousCode.push("79fed4bea538aebf54288d3ce11b57d3")
    } else if (purpousArray.includes("Зміцнення")) {
        purpousName.push("зміцнення")
        purpousCode.push("2f6b842c664ab63ee7f2e3a708dc4972")
    } else if (purpousArray.includes("Ліфтинг")) {
        purpousName.push("ліфтинг")
        purpousCode.push("1258631aae1294b5ba02ec0738d02cc6")
    } else if (purpousArray.includes("Матування")) {
        purpousName.push("матування")
        purpousCode.push("11b084c2460cb65da14b72a7f615e96d")
    } else if (purpousArray.includes("Очищення")) {
        purpousName.push("очищування")
        purpousCode.push("2e88f6aa6b70603b1641aaf165cafa61")
    } else if (purpousArray.includes("Проти акне")) {
        purpousName.push("від вугрів")
        purpousCode.push("266678285c6c170f33d67466590f850e")
    } else if (purpousArray.includes("Проти запалень")) {
        purpousName.push("протизапальний")
        purpousCode.push("a16914b385b288a20150223cd3fb7234")
    } else if (purpousArray.includes("Проти пігментних плям")) {
        purpousName.push("від пігментних плям")
        purpousCode.push("0f4998fdeda63ffc8681314acb7bec14")
    } else if (purpousArray.includes("Розгладження")) {
        purpousName.push("розгладжування")
        purpousCode.push("6437bcd252ec7e1dc910e3c88487f5d4")
    } else if (purpousArray.includes("Тонізування")) {
        purpousName.push("тонізація")
        purpousCode.push("49bc3b0ba9d07f9df800114fb3edc251")
    }
    paramArray.push({
        '#': purpousName.toString(),
        '$': {
            paramcode: '51',
            name: "Вид",
            valuecode: purpousCode.toString()
        }
    })
    return true;
}

module.exports = PurpousParam;
