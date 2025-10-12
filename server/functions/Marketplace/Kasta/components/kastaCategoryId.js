async function kastaCategoryId(categories) {
    const categoryId = categories[0].categoryId;

    if (categoryId === 1 || categoryId === 104) {
        if (categories.some(item => item.categoryId === 93)) {
            return `1`;
        } else if (categories.some(item => item.categoryId === 100)) {
            return `7`;
        } else if (categories.some(item => item.categoryId === 94)) {
            return `73`;
        }
        return `4`;
    } else if (categoryId === 2 || categoryId === 103) {
        if (categories.some(item => item.categoryId === 93)) {
            return `2`;
        } else if (categories.some(item => item.categoryId === 100)) {
            return `8`;
        } else if (categories.some(item => item.categoryId === 94)) {
            return `74`;
        }
        return `5`;
    } else if (categoryId === 3 || categoryId === 102) {
        if (categories.some(item => item.categoryId === 93)) {
            return `3`;
        } else if (categories.some(item => item.categoryId === 100)) {
            return `9`;
        } else if (categories.some(item => item.categoryId === 94)) {
            return `75`;
        }
        return `6`;
    } else if (categoryId === 98) {
        return `10`;
    } else if (categoryId === 5) {
        return `11`;
    } else if (categoryId === 19) {
        return `12`;
    } else if (categoryId === 99) {
        return `13`;
    } else if (categoryId === 106) {
        return `14`;
    } else if (categoryId === 16) {
        return `15`;
    } else if (categoryId === 44) {
        return `16`;
    } else if (categoryId === 105) {
        return `17`;
    } else if (categoryId === 7) {
        return `18`;
    } else if (categoryId === 75) {
        return `20`;
    } else if (categoryId === 45) {
        return `21`;
    } else if (categoryId === 49) {
        return `22`;
    } else if (categoryId === 36) {
        return `23`;
    } else if (categoryId === 54) {
        return `24`;
    } else if (categoryId === 30) {
        return `25`;
    } else if (categoryId === 32) {
        return `27`;
    } else if (categoryId === 40 || categoryId === 62) {
        return `28`;
    } else if (categoryId === 73 || categoryId === 29) {
        return `29`;
    } else if (categoryId === 33) {
        return `30`;
    } else if (categoryId === 66) {
        return `31`;
    } else if (categoryId === 27) {
        return `32`;
    } else if (categoryId === 26 || categoryId === 97) {
        return `35`;
    } else if (categoryId === 81) {
        return `36`;
    } else if (categoryId === 61) {
        return `37`;
    } else if (categoryId === 72 || categoryId === 28) {
        return `38`;
    } else if (categoryId === 96) {
        return `39`;
    } else if (categoryId === 65) {
        return `40`;
    } else if (categoryId === 41) {
        return `41`;
    } else if (categoryId === 35) {
        return `42`;
    } else if (categoryId === 22 || categoryId === 77) {
        return `43`;
    } else if (categoryId === 23) {
        return `44`;
    } else if (categoryId === 4 || categoryId === 78) {
        return `45`;
    } else if (categoryId === 76) {
        return `46`;
    } else if (categoryId === 55) {
        return `47`;
    } else if (categoryId === 21) {
        return `48`;
    } else if (categoryId === 46) {
        return `49`;
    } else if (categoryId === 20) {
        return `50`;
    } else if (categoryId === 6 || categoryId === 48 || categoryId === 63) {
        return `51`;
    } else if (categoryId === 130) {
        return `52`;
    } else if (categoryId === 70) {
        return `53`;
    } else if (categoryId === 51) {
        return `54`;
    } else if (categoryId === 126) {
        return `55`;
    } else if (categoryId === 127) {
        return `56`;
    } else if (categoryId === 129) {
        return `57`;
    } else if (categoryId === 128) {
        return `58`;
    } else if (categoryId === 125) {
        return `59`;
    } else if (categoryId === 131) {
        return `60`;
    } else if (categoryId === 113) {
        return `61`;
    } else if (categoryId === 114) {
        return `62`;
    } else if (categoryId === 116) {
        return `63`;
    } else if (categoryId === 115) {
        return `64`;
    } else if (categoryId === 123) {
        return `65`;
    } else if (categoryId === 122) {
        return `66`;
    } else if (categoryId === 124) {
        return `67`;
    } else if (categoryId === 121) {
        return `68`;
    } else if (categoryId === 120) {
        return `69`;
    } else if (categoryId === 119) {
        return `70`;
    } else if (categoryId === 117) {
        return `71`;
    } else if (categoryId === 118) {
        return `72`;
    } else {
        return ""
    }
}

module.exports = kastaCategoryId;
