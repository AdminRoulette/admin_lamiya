function CountName(count, language) {
    return count === 1 ? language ? `товар` : `товар`
        : count >= 2 && count <= 4
            ? language ? `товары` : `товари`
            : language ? `товаров` : `товарів`

}

module.exports = CountName;