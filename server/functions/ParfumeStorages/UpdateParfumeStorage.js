const TelegramMsg = require("../TelegramMsg");
const StylsStorage = require("./StylsStorage");
const SelectumStorage = require("./SelectumStorage");
const {DeviceOptions, Device, Brand, ParfumePart} = require("../../models/models");
const {Op} = require("sequelize");
const UpdateStock = require("../Product/UpdateStock");
const StorageProductCheck = require("./components/StorageProductCheck");
const axios = require("axios");

async function UpdateParfumeStorage() {
    try {
    const stylsProducts = await StylsStorage()
    const selectumProducts = await SelectumStorage()
    const allProductsFromList = [
        ...stylsProducts.data,
        ...selectumProducts
    ];

    const course = stylsProducts.course;
    let notValidList = [];
    let newList = [];
    let optionsIds = {};
    let updateStockIds = [];
    const skipSelectumIds = [5589, 4488,1561, 2981, 2977, 2979, 4114, 1684]

    for (const productFromList of allProductsFromList) {
            let query = productFromList.name;
            if (productFromList.tester) query += " Тестер"
            if (productFromList.weight) query += ` ${productFromList.weight} мл`
            if (productFromList.type) query += ` ${productFromList.type}`
            query = query.toLowerCase();
            const queries = [
                {
                    "match_phrase": {
                        "product_name.exact": {
                            "query": query, "slop": 2, "boost": 50
                        }
                    }
                }, {
                    "match_phrase": {
                        "product_name": {
                            "query": query, "slop": 2, "boost": 45
                        }
                    }
                }, {
                    "match": {
                        "product_name": {
                            "query": query, "operator": "or", "boost": 30
                        }
                    }
                }, {
                    "match": {
                        "product_name": {
                            "query": query, "operator": "or", "prefix_length": 2, "fuzziness": "AUTO", "boost": 25
                        }
                    }
                }, {
                    "match_phrase": {
                        "product_tags.exact": {
                            "query": query, "boost": 20.0
                        }
                    }
                }, {
                    "match_phrase": {
                        "product_tags": {
                            "query": query, "slop": 2, "boost": 15.0
                        }
                    }
                }, {
                    "match": {
                        "product_tags": {
                            "query": query, "fuzziness": "AUTO", "operator": "and", "boost": 10.0
                        }
                    }
                }, {
                    "match": {
                        "product_tags": {
                            "query": query, "fuzziness": "AUTO", "operator": "or", "boost": 5.0
                        }
                    }
                }]
            const searchRes = await axios.post('http://localhost:9200/options/_search', {
                size: 1,
                // min_score: 200,
                "query": {
                    "bool": {
                        "must": [{
                            "dis_max": {
                                "queries": queries, "tie_breaker": 0.3
                            }
                        }, {
                            "term": {
                                "codes": productFromList.code
                            }
                        }]
                    }
                }
            }, {
                auth: {
                    username: 'elasticuser', password: process.env.ELASTIC_PASS,
                }
            });
            if (searchRes.data.hits.hits.length > 0) {
                const id = +searchRes.data.hits.hits[0]._source.option_id;
                if (+searchRes.data.hits.hits[0]._score > 400) {
                    if (!optionsIds[id]) {
                        optionsIds[id] = {
                            name: productFromList.name,
                            type: productFromList.type,
                            full_name: productFromList.full_name,
                            tester: productFromList.tester,
                            weight: productFromList.weight,
                            values: []
                        };
                    }
                    optionsIds[id].values.push({
                        price: productFromList.price, list: productFromList.list, code: productFromList.code
                    })
                } else {
                    notValidList.push({
                        name: productFromList.name,
                        type: productFromList.type,
                        full_name: productFromList.full_name,
                        tester: productFromList.tester,
                        weight: productFromList.weight,
                        code: productFromList.code,
                        error: `Мало скору. Знайшли: ${searchRes.data.hits.hits[0]._source.product_name}`
                    })
                }
            } else {
                newList.push(productFromList)
            }
    }

    let options = await DeviceOptions.findAll({
        where: {
            code: {
                [Op.ne]: '', [Op.not]: null
            }
        },
        attributes: ['id', 'weight', 'optionName', 'deviceId', 'sell_type', 'code', 'price', 'startPrice', 'marketPrice'],
        include: [{model: Device, attributes: ['series', 'stock']}]
    });

    for (const option of options) {
        let calcPrice = 0;
        let storageType = "storage";
        let active_code = '';
        const optionData = optionsIds[option.id];
        if (optionData) {
            if (option.optionName.toLowerCase().includes("тестер") !== optionData.tester) {
                notValidList.push({...optionData, error: `Тестер версія не співпадає`})
                continue;
            }
            if ((option.weight !== optionData.weight) && !optionData.name.toLowerCase().includes('набір')) {
                notValidList.push({...optionData, error: `Вага ${option.weight} !== ${optionData.weight}`})
                continue;
            }
            if (optionData.type && (option.device.series !== optionData.type) && (option.device.series === 'Туалетна вода' || optionData.type === 'Туалетна вода') && !skipSelectumIds.includes(option.deviceId)) {
                notValidList.push({...optionData, error: `Тип парфумів не співпадає`})
                continue;
            }
            for (const value of optionData.values) {
                const optionStorageType = value.list === `s2` ? "preorder" : "storage"; // false якщо під замовлення. лише з s2 листа
                if (calcPrice === 0 || (calcPrice > course * value.price && optionStorageType) || (!storageType && optionStorageType)) {
                    calcPrice = course * value.price
                    active_code = value.code;
                    storageType = optionStorageType;
                }
            }
            const startPrice = Math.ceil(calcPrice / 5) * 5;
            const price = Math.ceil((startPrice * 1.17 + 150) / 5) * 5; // 17% наша націнка + 100 доставка
            const marketPrice = Math.ceil((startPrice * 1.12 * 1.25 + 150) / 5) * 5; // 10% наша націнка + 18% ком. маркетплейса + 2% закладаємо в оплату частинами + 150 доставка

            if (option.startPrice !== startPrice || option.price !== price || option.marketPrice !== marketPrice
                || option.sell_type !== storageType || option.active_code !== active_code) {
                await DeviceOptions.update({
                    startPrice, price, marketPrice, sell_type: storageType, active_code
                }, {where: {id: option.id}})
                if (!option.device.stock) updateStockIds.push(option.deviceId)
            }

        } else {
            if (option.sell_type === "preorder" || option.sell_type === "storage") {
                await DeviceOptions.update({
                    sell_type: "",
                    actual_code:""
                }, {where: {id: option.id}})
                updateStockIds.push(option.deviceId)
            }
        }
    }
    if (updateStockIds.length > 0) {
        UpdateStock(updateStockIds)
    }


    // for (const key in optionsIds) {
    //     const productData = optionsIds[key];
    //     let option = await DeviceOptions.findOne({
    //         include: [{
    //             model: DeviceOptions,
    //             where: {id: key}
    //         }]
    //     })
    //
    //     for (const data of productData) {
    //
    //         if (option.optionName.toLowerCase().includes("тестер") !== data.tester) {
    //             notValidList.push({...data, error: `Тестер версія не співпадає`})
    //             continue;
    //         }
    //         if (option.weight !== data.weight) {
    //             notValidList.push({...data, error: `Вага ${option.weight} !== ${data.weight}`})
    //             continue;
    //         }
    //         if (device.series !== data.type) {
    //             notValidList.push({...data, error: `Тип парфумів не співпадає`})
    //             continue;
    //         }
    //     }
    // }
    // let options = await DeviceOptions.findAll({
    //     where: {
    //         code: {
    //             [Op.ne]: '', [Op.not]: null
    //         }
    //     }, include: [{
    //         model: Device,
    //         attributes: ['name'],
    //         include: [{model: Brand, attributes: ['name']}, {model: ParfumePart}]
    //     }]
    // })
    //
    // for (let i = 0; i < options.length; i++) {
    //     if (options[i].count > 0) continue; // якщо у нас в наявності, то скіп
    //     let codeArray = options[i].code.split(",");
    //     let new_price = 0;
    //     let storageType = false;
    //     for (let b = 0; b < codeArray.length; b++) {
    //         const code = codeArray[b];
    //
    //         if (code.length < 2) {
    //             notValidList[code] = {
    //                 error: "Короткий код",
    //                 name: allProducts[code],
    //                 option_name: `${options[i].device.name} ${options[i].optionName}`,
    //                 option_codes: options[i].code
    //             }
    //             continue;
    //         }
    //         const excelInfo = allProducts[code];
    //         if (!excelInfo) continue;
    //
    //         if (Array.isArray(excelInfo)) {
    //             let allInvalid = true;
    //             for (let d = 0; d < excelInfo.length; d++) {
    //                 const optionStorageType = excelInfo[d].list !== `s2`; // false якщо під замовлення. лише з s2 листа
    //                 try {
    //                     const product_price = await StorageProductCheck(options[i].weight, excelInfo[d], options[i]);
    //
    //                     if (new_price === 0 || (new_price > course * product_price && optionStorageType) || (!storageType && optionStorageType)) {
    //                         new_price = course * excelInfo[d].price
    //                         storageType = optionStorageType;
    //                         delete notValidList[code];
    //                     }
    //
    //                     if (excelInfo.length > 1) {
    //                         excelInfo.splice(d, 1);
    //                         allProducts[code] = excelInfo;
    //                     } else {
    //                         delete allProducts[code];
    //                     }
    //                     allInvalid = false;
    //                     break;
    //                 } catch (error) {
    //                     if (d === excelInfo.length - 1) {
    //                         notValidList[code] = {
    //                             error: error.message,
    //                             name: excelInfo,
    //                             option_name: `${options[i].device.name} ${options[i].optionName}`,
    //                             option_codes: options[i].code
    //                         }
    //                     }
    //                 }
    //             }
    //         } else {
    //             const optionStorageType = excelInfo.list !== `s2`; // false якщо під замовлення. лише з s2 листа
    //             try {
    //                 const product_price = await StorageProductCheck(options[i].weight, excelInfo, options[i]);
    //
    //                 if (new_price === 0 || (new_price > course * product_price && optionStorageType) || (!storageType && optionStorageType)) {
    //                     new_price = course * excelInfo.price
    //                     storageType = optionStorageType;
    //                     delete notValidList[code];
    //                 }
    //                 delete allProducts[code];
    //             } catch (error) {
    //                 notValidList[code] = {
    //                     error: error.message,
    //                     name: excelInfo,
    //                     option_name: `${options[i].device.name} ${options[i].optionName}`,
    //                     option_codes: options[i].code
    //                 }
    //             }
    //         }
    //     }
    //
    //     if (new_price) {
    //         const startPrice = Math.ceil(new_price / 5) * 5;
    //         const price = Math.ceil((startPrice * 1.17 + 100) / 5) * 5; // 17% наша націнка + 100 доставка
    //         const marketPrice = Math.ceil((startPrice * 1.12 * 1.25 + 150) / 5) * 5; // 10% наша націнка + 18% ком. маркетплейса + 2% закладаємо в оплату частинами + 150 доставка
    //
    //         if (options[i].startPrice !== startPrice  || options[i].price !== price || options[i].marketPrice !== marketPrice || options[i].preorder !== !storageType || options[i].storage !== storageType) {
    //             await DeviceOptions.update({
    //                 startPrice, price, marketPrice, preorder: !storageType, storage: storageType}, {where: {id: options[i].id}})
    //             productIds.push(options[i].deviceId)
    //         }
    //     } else if (options[i].preorder || options[i].storage) {
    //         await DeviceOptions.update({
    //             preorder: false, storage: false
    //         }, {where: {id: options[i].id}})
    //         productIds.push(options[i].deviceId)
    //     }
    // }
    // if (productIds.length > 0) {
    //     UpdateStock(productIds)
    // }

    return {all: optionsIds, error: notValidList, new: newList};

    } catch (error) {
        console.log(error)
        TelegramMsg("TECH", `Error UpdateParfumeStorage ${error.message}`)
    }
}

module.exports = UpdateParfumeStorage;
