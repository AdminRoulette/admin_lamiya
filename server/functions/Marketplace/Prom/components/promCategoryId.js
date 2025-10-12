
function promCategoryId(categoryId,on_tab) {

    if (on_tab) {
        return `39`  //Розпив категорія
    }else if (categoryId === 104 || categoryId === 1 || categoryId === 106) {
        return `1`
    }else if (categoryId === 2 || categoryId === 103) {
        return `2`
    }else if (categoryId === 26 || categoryId === 61 || categoryId === 81 || categoryId === 97) {
        return `3`
    }else if (categoryId === 28 || categoryId === 27) {
        return `4`
    }else if (categoryId === 73 || categoryId === 29) {
        return `5`
    }else if (categoryId === 75 || categoryId === 40 || categoryId === 62 || categoryId === 30) {
        return `6`
    }else if (categoryId === 32) {
        return `7`
    }else if (categoryId === 49 || categoryId === 33) {
        return `8`
    }else if (categoryId === 117 || categoryId === 120 || categoryId === 118) {
        return `9`
    }else if (categoryId === 36) {
        return `10`
    }else if (categoryId === 5 || categoryId === 45) {
        return `11`
    }else if (categoryId === 16) {
        return `12`
    }else if (categoryId === 7) {
        return `13`
    }else if (categoryId === 99) {
        return `14`
    }else if (categoryId === 20) {
        return `15`
    }else if (categoryId ===  21) {
        return `16`
    }else if (categoryId === 23) {
        return `17`
    }else if (categoryId === 4 || categoryId === 22 || categoryId === 77 || categoryId === 46
    || categoryId === 78 || categoryId === 6 || categoryId === 63 || categoryId === 48
    || categoryId === 76) {
        return `18`
    }else if (categoryId === 19) {
        return `19`
    }else if (categoryId === 44) {
        return `20`
    }else if (categoryId === 72) {
        return `21`
    }else if (categoryId === 51) {
        return `22`
    }else if (categoryId === 54 || categoryId === 55 || categoryId === 105) {
        return `23`
    }else if (categoryId === 66) {
        return `24`
    }else if (categoryId === 98) {
        return `25`
    }else if (categoryId === 121 || categoryId === 123) {
        return `26`
    }else if (categoryId === 122) {
        return `27`
    }else if (categoryId === 124) {
        return `28`
    }else if (categoryId === 113) {
        return `29`
    }else if (categoryId === 114) {
        return `30`
    }else if (categoryId === 115) {
        return `31`
    }else if (categoryId === 116) {
        return `32`
    }else if (categoryId === 70 || categoryId === 125) {
        return `33`
    }else if (categoryId === 130 || categoryId === 131 || categoryId === 127 || categoryId === 128) {
        return `34`
    }else if (categoryId === 129) {
        return `35`
    }else if (categoryId === 126) {
        return `36`
    }else if (categoryId === 71 || categoryId === 35 || categoryId === 74 || categoryId === 65
        || categoryId === 96) {
        return `37`
    }else if (categoryId === 102 || categoryId === 3) {
        return `38`
    }else if (categoryId === 119) {
        return `40`
    }else {
        return ""
    }
}

module.exports = promCategoryId;
