async function calculatePurpose(purposes, paramArray) {
    if (!purposes) {
        return false;
    }
    let purposesArray = [];
    for( const purpose of purposes ) {
        if (purpose.id === 53) {
            purposesArray.push({ name: "Для сяйва шкіри", code: "2383122" });
        }
        if (purpose.id === 72) {
            purposesArray.push({ name: "Від висипань", code: "2378383" });
        }
        if (purpose.id === 74) {
            purposesArray.push({ name: "Проти розацеа", code: "3423571" });
        }
        if (purpose.id === 57) {
            purposesArray.push({ name: "Проти сухості", code: "2378425" });
        }
        if (purpose.id === 1085) {
            purposesArray.push({ name: "Детокс", code: "2389932" });
        }
        if (purpose.id === 76) {
            purposesArray.push({ name: "Тонізуюче", code: "2616076" });
        }
        if (purpose.id === 73) {
            purposesArray.push({ name: "Проти пігментних плям", code: "2378389" });
        }
        if (purpose.id === 62) {
            purposesArray.push({ name: "Для звуження пор", code: "2615572" });
        }
        if (purpose.id === 95) {
            purposesArray.push({ name: "Антивіковий", code: "2378353" });
        }
        if (purpose.id === 67) {
            purposesArray.push({ name: "Антиоксидантне", code: "2382780" });
        }
        if (purpose.id === 87) {
            purposesArray.push({ name: "Проти подразнення", code: "2384364" });
        }
        if (purpose.id === 68) {
            purposesArray.push({ name: "Антибактеріальне", code: "2383110" });
        }
        if (purpose.id === 69) {
            purposesArray.push({ name: "Відлущувальне", code: "2378371" });
        }
        if (purpose.id === 72) {
            purposesArray.push({ name: "Протизапальне", code: "2378407" });
        }
        if (purpose.id === 61) {
            purposesArray.push({ name: "Зволожувальне", code: "2378449" });
        }
        if (purpose.id === 64) {
            purposesArray.push({ name: "Ліфтинг", code: "2378401" });
        }
        if (purpose.id === 89) {
            purposesArray.push({ name: "Проти зморщок", code: "2378335" });
        }
        if (purpose.id === 47) {
            purposesArray.push({ name: "Проти темних кіл", code: "2378341" });
        }
        if (purpose.id === 50) {
            purposesArray.push({ name: "Відновлююче", code: "2383104" });
        }
        if (purpose.id === 65) {
            purposesArray.push({ name: "Матувальне", code: "2378347" });
        }
        if (purpose.id === 58) {
            purposesArray.push({ name: "Заспокійлива", code: "2378941" });
        }
        if (purpose.id === 45) {
            purposesArray.push({ name: "Проти куперозу", code: "2382816" });
        }
        if (purpose.id === 57) {
            purposesArray.push({ name: "Живильне", code: "2378935" });
        }
        if (purpose.id === 49) {
            purposesArray.push({ name: "Відбілювальне", code: "2378929" });
        }
    }
    if (purposesArray.length > 0) {
        const names = purposesArray.map(item => item.name).join(',');
        const codes = purposesArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '201949', '@name': 'Призначення', '@valueid': codes
        })
    }
    return true;
}

module.exports = calculatePurpose;
