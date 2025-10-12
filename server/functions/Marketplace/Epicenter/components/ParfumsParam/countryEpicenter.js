function countryEpicenter(countryId) {

    if (countryId === 1) {
        return {countryName: "Україна", countryId: "ukr"}
    } else if (countryId === 2) {
        return {countryName: "Південна Корея", countryId: "kor"}
    } else if (countryId === 3) {
        return {countryName: "Індонезія", countryId: "idn"}
    } else if (countryId === 4) {
        return {countryName: "Італія", countryId: "ita"}
    } else if (countryId === 5) {
        return {countryName: "Данія", countryId: "dnk"}
    } else if (countryId === 6) {
        return {countryName: "ОАЕ", countryId: "are"}
    } else if (countryId === 7) {
        return {countryName: "Швейцарія", countryId: "che"}
    } else if (countryId === 8) {
        return {countryName: "Франція", countryId: "fra"}
    } else if (countryId === 9) {
        return {countryName: "США", countryId: "usa"}
    } else if (countryId === 10) {
        return {countryName: "Туреччина", countryId: "tur"}
    } else if (countryId === 11) {
        return {countryName: "Нідерланди", countryId: "nld"}
    }else if (countryId === 12) {
        return {countryName: "Іспанія", countryId: "esp"}
    }else if (countryId === 13) {
        return {countryName: "Німеччина", countryId: "deu"}
    }else if (countryId === 14) {
        return {countryName: "Австралія", countryId: "aus"}
    }else if (countryId === 15) {
        return {countryName: "Велика Британія", countryId: "gbr"}
    }else if (countryId === 16) {
        return {countryName: "Швеція", countryId: "swe"}
    }else if (countryId === 17) {
        return {countryName: "Оман", countryId: "omn"}
    }else if (countryId === 18) {
        return {countryName: "Японія", countryId: "jpn"}
    } else {
        return {countryName: undefined, countryId: undefined}
    }
}

module.exports = countryEpicenter;