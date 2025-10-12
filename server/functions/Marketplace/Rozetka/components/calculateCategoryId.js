async function calculateCategoryId(categoryId) {


    if (categoryId === 1 || categoryId === 3 || categoryId === 106|| categoryId === 102|| categoryId === 104) {
        return `1`;
    } else if (categoryId === 2 || categoryId === 103) {
        return `2`;
    } else if (categoryId === 26 || categoryId === 97 || categoryId === 81 || categoryId === 61) {
        return `3`;
    } else if (categoryId ===27) {
        return `4`;
    } else if (categoryId ===73 || categoryId === 29) {
        return `5`;
    } else if (categoryId ===40 || categoryId === 75 || categoryId === 30 || categoryId === 62) {
        return `6`;
    } else if (categoryId ===32) {
        return `7`;
    } else if (categoryId ===49 || categoryId === 33) {
        return `8`;
    } else if (categoryId === 120 || categoryId === 119 || categoryId === 118 || categoryId === 117) {
        return `9`;
    } else if (categoryId ===36) {
        return `10`;
    } else if (categoryId ===45) {
        return `11`;
    } else if (categoryId ===5) {
        return `12`;
    } else if (categoryId ===7) {
        return `13`;
    } else if (categoryId ===99) {
        return `14`;
    } else if (categoryId ===16) {
        return `15`;
    } else if (categoryId ===20) {
        return `16`;
    } else if (categoryId ===21) {
        return `17`;
    } else if (categoryId ===22 || categoryId === 77) {
        return `18`;
    } else if (categoryId ===23 || categoryId === 46) {
        return `19`;
    } else if (categoryId ===76 || categoryId ===4 || categoryId ===78) {
        return `20`;
    } else if (categoryId ===48 || categoryId ===63 || categoryId ===6) {
        return `21`;
    } else if (categoryId ===19) {
        return `22`;
    } else if (categoryId ===44) {
        return `23`;
    } else if (categoryId ===28) {
        return `24`;
    } else if (categoryId === 51) {
        return `25`;
    } else if (categoryId ===54) {
        return `26`;
    } else if (categoryId ===55) {
        return `27`;
    } else if (categoryId === 66) {
        return `28`;
    } else if (categoryId === 70) {
        return `29`;
    } else if (categoryId ===98) {
        return `30`;
    } else if (categoryId ===123) {
        return `31`;
    } else if (categoryId ===121) {
        return `32`;
    } else if (categoryId ===122) {
        return `33`;
    } else if (categoryId ===124) {
        return `34`;
    } else if (categoryId ===113) {
        return `35`;
    } else if (categoryId ===114) {
        return `36`;
    } else if (categoryId ===115) {
        return `37`;
    } else if (categoryId ===116) {
        return `38`;
    } else if (categoryId === 125) {
        return `39`;
    } else if (categoryId === 130 || categoryId === 131) {
        return `40`;
    } else if (categoryId === 129) {
        return `41`;
    } else if (categoryId === 126) {
        return `42`;
    } else if (categoryId === 128 || categoryId === 127) {
        return `43`;
    } else if (categoryId === 105) {
        return `44`;
    } else if (categoryId === 71 || categoryId === 72
        || categoryId === 65 || categoryId === 35 || categoryId === 96 || categoryId === 74){
        return `45`;
    } else {
        return ""
    }
}

module.exports = calculateCategoryId;
