
async function ProductCategoryList(categoryList,language) {
   let categoryArray = [];
    categoryArray.push({name:language?categoryList.name_ru:categoryList.name,code:categoryList.code,level:categoryList.level,parentId:categoryList.parentId,id:categoryList.id})

    function getCategoryNames(category = []) {
        if (category) {
            categoryArray.push({name:language?category.name_ru:category.name,
                code:category.code,level:category.level,parentId:category.parentId,id:category.id});
            getCategoryNames(category.parent);
        }
    }

    getCategoryNames(categoryList.parent);
    return categoryArray;
}

module.exports = ProductCategoryList;