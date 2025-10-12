function epicenterCategory4(paramArray, categoryId) {
    
    paramArray.push({
        '#': categoryId === 81?"емульсія"
            :categoryId === 61?"есенція"
                :categoryId === 30?"флюїд"
                    :"сироватка",
            '@paramcode': '51',
            '@name': "Вид",
            "@valuecode":categoryId === 81?"730fd05c985954e344c2de6783520c23"
                :categoryId === 61?"697ab40f65d6fa79911e373c4d202195"
                    :categoryId === 30?"n7hrvbcvhymmssri"
                        :"xvflwjdiigazwxyf"
    })
}
module.exports = epicenterCategory4;
