async function kastaCategoryId(categories) {
    const categoryId = categories[0].categoryId;

    if (categoryId === 65) {
        return `1`;
    } else if (categoryId === 27) {
        return `2`;
    } else if (categoryId === 56) {
        return `3`;
    } else if (categoryId === 28) {
        return `4`;
    } else if (categoryId === 16 || categoryId === 73 || categoryId === 22 || categoryId === 68 || categoryId === 74) {
        return `5`;
    } else if (categoryId === 72) {
        return `6`;
    } else if (categoryId === 35) {
        return `7`;
    } else if (categoryId === 69 ) {
        return `8`;    
    } else if (categoryId === 23) {
        return `9`;    
    } else if (categoryId === 79) {
        return `10`;
    } else if (categoryId === 78) {
        return `11`;
    } else if (categoryId === 34) {
        return `12`;
    } else if (categoryId === 80) {
        return `13`;
    } else if (categoryId === 63) {
        return `14`;
    } else if (categoryId === 43 || categoryId === 44) {
        return `16`;
    } else if (categoryId === 69) {
        return `17`;
    } else if (categoryId === 70) {
        return `18`;
    } else if (categoryId === 82) {
        return `19`;		
    } else if (categoryId === 81) {
        return `20`;
    } else if (categoryId === 31) {
        return `21`;
    } else if (categoryId === 17) {
        return `22`;
    } else if (categoryId === 32) {
        return `23`;
    } else if (categoryId === 83) {
        return `24`;
    } else if (categoryId === 58) {
        return `25`;
    } else if (categoryId === 47) {
        return `26`;		
    } else if (categoryId === 76) {
        return `27`;
    } else if (categoryId === 48) {
        return `28`;
    } else if (categoryId === 25) {
        return `29`;
    } else if (categoryId === 33 || categoryId === 18) {
        return `30`;
    } else if (categoryId === 67) {
        return `31`;
    } else if (categoryId === 14) {
        return `32`;
    } else if (categoryId === 60) {
        return `33`;
    } else if (categoryId === 66) {
        return `34`;		
    } else if (categoryId === 61) {
        return `35`;
    } else if (categoryId === 71) {
        return `36`;
    } else if (categoryId === 24) {
        return `37`;
    } else if (categoryId === 39 || categoryId === 40) {
        return `38`;
    } else if (categoryId === 64) {
        return `39`;
    } else if (categoryId === 52) {
        return `40`;
    } else if (categoryId === 62) {
        return `41`;
    } else {
        return ""
    }
}

module.exports = kastaCategoryId;
