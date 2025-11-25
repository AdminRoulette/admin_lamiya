async function kastaCategoryId(categories) {
    const categoryId = categories?.[0]?.categoryId;

    if (categoryId === 17 || categoryId === 24|| categoryId === 19 || categoryId === 18 || categoryId === 20 ||categoryId === 22) {
        return `1`;
    }else if (categoryId === 21){
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
    }
    // else if (categories.some(item => item.categoryId === 17)) {
    //     return `2`;
    // } else if (categoryId === 52) {
    //     return `3`;
    // }

    return ""
}

module.exports = kastaCategoryId;
