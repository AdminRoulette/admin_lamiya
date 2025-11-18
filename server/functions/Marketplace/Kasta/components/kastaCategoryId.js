async function kastaCategoryId(categories) {
    const categoryId = categories[0].categoryId;

    if (categoryId === 17) {
        return `1`;
    } else if (categories.some(item => item.categoryId === 17)) {
        return `2`;
    } else if (categoryId === 52) {
        return `3`;
    } else {
        return ""
    }
}

module.exports = kastaCategoryId;
