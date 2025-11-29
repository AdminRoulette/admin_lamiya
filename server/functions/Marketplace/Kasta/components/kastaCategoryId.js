async function kastaCategoryId(categories) {
    const categoryId = categories?.[0]?.categoryId;

    if (categoryId === 17 || categoryId === 24|| categoryId === 19 || categoryId === 18 || categoryId === 20 ||categoryId === 22) {
        return `1`;
    }else if (categoryId === 21 || categoryId === 68){
        return `2`;
    }else if (categoryId === 35){
        return `3`;
    }else if (categoryId === 32){
        return `4`;
    }else if (categoryId === 34){
        return `5`;
    }else if (categoryId === 33){
        return `6`;
    }else if (categoryId === 26 || categoryId === 25){
        return `7`;
    }else if (categoryId === 27){
        return `8`;
    }else if (categoryId === 16){
        return `9`;
    }else if (categoryId === 52){
        return `10`;
    }else if (categoryId === 63){
        return `11`;
    }else if (categoryId === 24) {
        return `12`;
    }else if (categoryId === 33 || categoryId === 18) {
        return `13`;
    }else if (categoryId === 19 || categoryId === 72) {
        return `14`;
    }else if (categoryId === 67){
        return `15`;
    }else if (categoryId === 69){
        return `16`;
    }else if (categoryId ===  26 || categoryId === 16){
        return `17`;
    }else if (categoryId === 19){
        return `18`;
    }else if (categoryId === 70){
        return `19`;
    }else if (categoryId === 25){
        return `20`;
    }else if (categoryId === 71){
        return `21`;
    }
    // else if (categories.some(item => item.categoryId === 17)) {
    //     return `2`;
    // }

    return ""
}

module.exports = kastaCategoryId;
