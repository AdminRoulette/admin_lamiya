async function epicenterParfumeType(types, paramArray) {
    if (!types) {
        return false;
    }
    let typeArray = [];
    for (const type of types) {
        if (type.filter_id === 14) {
            typeArray.push({name: "квіткові", code: "cb80dea1f578326045bacc36254a04d4"})
        }
        if (type.filter_id === 15) {
            typeArray.push({name: "фруктові", code: "84cca11d59df4146b5485ea36a7b423c"})
        }
        if (type.filter_id === 16) {
            typeArray.push({name: "свіжі", code: "f76b5025a29b0fdefb3dd6b90ab85d6c"})
        }
        if (type.filter_id === 3) {
            typeArray.push({name: "пряні", code: "8ebed1e5b459b8c55a6b179016b20499"})
        }
        if (type.filter_id === 17) {
            typeArray.push({name: "деревні", code: "ec4401775fb6d3bf25bf7b29946d14d0"})
        }
        if (type.filter_id === 18) {
            typeArray.push({name: "шипрові", code: "17c68c8197b29f8cad5c2f15747a179f"})
        }
        if (type.filter_id === 19) {
            typeArray.push({name: "фужерні", code: "d740a44dc9a892319d10336f1bb8235a"})
        }
        if (type.filter_id === 20) {
            typeArray.push({name: "східні", code: "df53254bab2386021421d96e97e1c83f"})
        }
        if (type.filter_id === 23) {
            typeArray.push({name: "пудровий", code: "32749692adda38ae21a5e53c78529668"})
        }
        if (type.filter_id === 24) {
            typeArray.push({name: "водяні", code: "1e4992bee1d79a2c315d955afc85b50c"})
        }
        if (type.filter_id === 25) {
            typeArray.push({name: "солодкі", code: "db21e2ce350e211592b60775d3664f80"})
        }
        if (type.filter_id === 26) {
            typeArray.push({name: "мускусні", code: "a93c4aea9da89f68f1f4c26f8268ea71"})
        }
        if (type.filter_id === 32) {
            typeArray.push({name: "амброві", code: "d0e123eb33fa1ef8cc9d56370826dddd"})
        }
        if (type.filter_id === 9) {
            typeArray.push({name: "шкіряні", code: "c70aaba00bc0d0ca4d64125497e6e165"})
        }
        if (type.filter_id === 5) {
            typeArray.push({name: "цитрусові", code: "eb9f65002314ea7076c59eced50abb89"})
        }
        if (type.filter_id === 4) {
            typeArray.push({name: "альдегідні", code: "5cf7cba7953303496e292ddd0ebf5313"})
        }
        if (type.filter_id === 13) {
            typeArray.push({name: "зелені", code: "49aa9f6a2c5ab176c1c9c73ea86f2500"})
        }
    }
    if (typeArray.length > 0) {
        const names = typeArray.map(item => item.name).join(',');
        const codes = typeArray.map(item => item.code).join(',');

        paramArray.push({
            '#': names,
                '@paramid': '2851', '@name': 'Група ароматів', '@valueid': codes
        })
    }
    return true;
}

module.exports = epicenterParfumeType;
