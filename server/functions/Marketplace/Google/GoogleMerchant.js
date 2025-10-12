async function GoogleMerchant(options, product) {

    let stock = false;
    let isOnTab =  options.some(item => item.sell_type === "on_tab");
    let index = options.findIndex(item => item.count > 0 || item.sell_type === "preorder" || item.sell_type === 'storage')
    if(index === -1){
        index = 0;
    }else{
        stock = true;
    }

    // const {name, categoryId} = await categoriesGoogle(product.product_categories[0]?.category)


    // labels.push(name)
    async function Name(product) {
        let name = `${product.name} ${product.series}`;

        return name
            .replaceAll("&", "&amp;")
            .replaceAll(`"`, "&quot;")
            .replaceAll(">", "&gt;")
            .replaceAll("<", "&lt;")
            .replaceAll(`'`, "&apos;")
    }

    const price = stock ? `${options[index].price}.00 UAH` : `${options[0].price}.00 UAH`;
    const obj = {
        'g:id': `${product.id}`,
        'g:brand': product.brand.name,
        'g:title': await Name(product),
        'g:description': product.disc,
        'g:link': `https://lamiya.com.ua/product/${product.link}`,
        'g:image_link': options[index].deviceimages?.[0]?.image,
        ...(
            options[index].deviceimages?.length > 1
                ? {'g:additional_image_link': options[index].deviceimages.slice(1).map(imgObj => imgObj.image)}
                : {}
        ),
        'g:condition': 'new',
        'g:availability': stock ? "in_stock" : "out_of_stock",
        'g:sale_price': options[index].saleprice > 0 ? `${options[index].saleprice}.00 UAH` : price,
        'g:price': price,
        // item_group_id ??
        // 'product_type': "",
        // ...(
        //     categoryId
        //         ? {'g:google_product_category': categoryId}
        //         : {}
        // ),
        ...(
            options[index].gtin && stock
                ? {'g:gtin': options[index].gtin}
                : {}
        ),
        'g:custom_label_0': product.brand.name,
        ...(
            isOnTab
                ? {'g:custom_label_1': 'розпив'}
                : {}
        ),
        ...(
            stock
                ? {
                    'g:pickup_method': 'buy',
                    'g:pickup_sla': 'same_day',
                    'g:store_code': '13987328744790661916',
                    'g:quantity': 5
                }
                : {}
        ),

    }
    return obj;

}

module.exports = GoogleMerchant;