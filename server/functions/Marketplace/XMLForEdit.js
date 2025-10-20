async function XMLForEdit(product) {

    return {
            id: product.id,
            name: product.name_ru,
            name_ua: product.name,
            description: product.disc_ru,
            description_ua: product.disc,
            keywords: product.tags_ru,
            keywords_ua: product.tags
    }

}

module.exports = XMLForEdit;