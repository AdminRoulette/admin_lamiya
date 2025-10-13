require("dotenv").config();
const crypto = require('crypto');
const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const sequelize = require('./db');
const compression = require('compression');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const {
    PaymentOrder,
    Orders,
    DeliveryOrder,
    Cashiers,
    Device,
    Brand,
    DeviceOptions,
    ParfumePart,
    nova_poshta_cities,
    ukr_poshta_cities,
    ukr_poshta_warehouses,
    nova_poshta_warehouses,
    Supply, Expenses, Accounting, Shops, User, ChecksOrder, FopsList, CheckOrderQueue, OrderDevice, UserStats,
    nova_poshta_streets
} = require("./models/models");
const axios = require("axios");
const cron = require("node-cron");
const {Op, literal, col, fn} = require("sequelize");
const TelegramMsg = require("./functions/TelegramMsg");
const CheckBox = require("./functions/CheckBox/CheckBox");
const Marketplace = require("./functions/Marketplace/Marketplace");
const apiError = require("./error/apierror");
const UpdateParfumeStorage = require("./functions/ParfumeStorages/UpdateParfumeStorage");

let host;
let port;
if (process.env.NODE_ENV === "production") {
    host = process.env.DB_HOST;
    port = process.env.PORT || 443;
} else {
    host = process.env.DB_HOST_DEV;
    port = 5000;
}

const WebSocket = require('ws');
const MonoPartPayments = require("./functions/PartPayments/MonoPartPayments");
const wss = new WebSocket.Server({port: 8080});


//Веб сокет для оновлення оплати частинами в адмінці
wss.on('connection', (ws) => {
    let interval = null;

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            const {type} = data;

            if (type === 'part_payment' && orderId) {

                interval = setInterval(async () => {
                    try {
                        const payment = await PaymentOrder.findOne({
                            where: {orderId: orderId},
                            attributes: ['status'],
                        })

                        if (!payment) return;

                        if (payment.status === 'failure' || payment.status === 'paid') {
                            ws.send(JSON.stringify(payment.status === 'failure' ? {payment_status: 'failure'} : {payment_status: 'paid'}));
                            clearInterval(interval);
                            ws.close();
                        }
                    } catch (err) {
                        console.error('DB check error:', err);
                    }
                }, 4000);
            } else {
                ws.close(1008, 'Invalid subscribe data');
            }
        } catch (err) {
            ws.close(1003, 'Invalid JSON');
            console.error('Invalid message from client:', err);
        }
    });

    ws.on('close', () => {
        if (interval) clearInterval(interval);
    });
});

app.use(compression());

// cron.schedule('55 */2 * * *', async () => {
//     try {
//         if (process.env.NODE_ENV === "production") {
//             await Marketplace()
//         }
//     } catch (e) {
//         TelegramMsg("TECH", `ReNew Marketplace ${e.message}`)
//     }
// }, {
//     timezone: 'Europe/Kyiv'
// });
//
// cron.schedule('01 17 * * *', async () => {
//     try {
//         if (process.env.NODE_ENV === "production") {
//             await UpdateParfumeStorage()
//         }
//     } catch (e) {
//         TelegramMsg("TECH", `ReNew UpdateParfumeStorage ${e.message}`)
//     }
// }, {
//     timezone: 'Europe/Kyiv'
// });

//update empty brand
cron.schedule('50 23 * * 3', async () => {
    try {
        const brands = await Brand.findAll({
            attributes: ['id'],
            include: [
                {
                    model: Device, attributes: ["id"], limit: 1
                }
            ]
        })
        for (let brand of brands) {
            const device_count = await Device.count({
                where: {active: true, brandId: brand.id},
            })
            const empty = device_count === 0 || brand.id === 129;
            const priority = device_count > 20;
            if (brand.empty !== empty || brand.priority !== priority) {
                await Brand.update(
                    {empty, priority},
                    {where: {id: brand.id}}
                );
            }
        }
    } catch (e) {
        TelegramMsg("TECH", `Brands update empty ${e.message}`)
    }
}, {
    timezone: 'Europe/Kyiv'
});

// Accounting
// cron.schedule('1 0 1 * *', async () => {
//     try {
//         const now = new Date();
//         const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);
//         startOfLastMonth.setHours(3, 0, 0, 0);
//         const endOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
//         endOfLastMonth.setHours(26, 59, 0, 0);
//         let total_supply = 0;
//         let total_expenses = 0;
//         let stock = {'Аналогові парфуми': 0};
//         let parfume_tab_stock = 0;
//         let total_money_card = 0;
//         let order_invalid_status = [];
//
//         await Orders.findAll({
//             include: [{
//                 model: DeliveryOrder
//             }], where: {
//                 createdAt: {
//                     [Op.and]: {
//                         [Op.gt]: new Date(startOfLastMonth),
//                         [Op.lt]: new Date(endOfLastMonth)
//                     }
//                 }
//             }
//         }).then((orders) => {
//             for (const orderElem of orders) {
//                 total_money_card += orderElem.moneyCard;
//                 if (!(orderElem.status_id === 2 || orderElem.status_id === 9 || orderElem.status_id === 11
//                     || orderElem.status_id === 41000 || orderElem.status_id === 48000 || orderElem.status_id === 10111 || orderElem.status_id === 10999)) {
//                     order_invalid_status.push(orderElem.id);
//                 }
//             }
//         });
//         await Supply.findAll({
//             where: {
//                 createdAt: {
//                     [Op.and]: {
//                         [Op.gt]: new Date(startOfLastMonth),
//                         [Op.lt]: new Date(endOfLastMonth)
//                     }
//                 }
//             }
//         }).then((supplyList) => {
//             supplyList.map((supply) => {
//                 if (supply.WhoPayed === 0) {
//                     total_supply += supply.price;
//                 }
//             })
//         })
//         await Expenses.findAll({
//             where: {
//                 createdAt: {
//                     [Op.and]: {
//                         [Op.gt]: new Date(startOfLastMonth),
//                         [Op.lt]: new Date(endOfLastMonth)
//                     }
//                 }
//             }
//         }).then((expensesList) => {
//             for (const expense of expensesList) {
//                 total_expenses += expense.money;
//             }
//         })
//
//         await Accounting.findOne({
//             limit: 1, order: [['id', 'DESC']]
//         }).then(async (accounting) => {
//             await Accounting.create({
//                 money_left: accounting.money_left + total_money_card - total_expenses - total_supply,
//                 stock: JSON.stringify(stock),
//                 parfume_tab_stock
//             })
//         })
//
//
//         if ('order_invalid_status'.length > 0) {
//             TelegramMsg("TECH", `Замовлення з дивними статусами: ${order_invalid_status}`)
//         }
//     } catch (e) {
//         TelegramMsg("TECH", `create Accounting ${e.message}`)
//     }
// }, {
//     timezone: 'Europe/Kyiv'
// });

//renew nova_city_list
cron.schedule('20 02 * * *', async () => {
    try {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const allCitiesDb = await nova_poshta_cities.findAll();
        const dbMap = new Map(allCitiesDb.map(city => [city.ref, city]));
        let page = 1;
        while (true) {
            const response = await axios.post(process.env.NOVA_POSHTA_URL, {
                apiKey: process.env.NOVA_POSHTA_API_KEY,
                modelName: 'AddressGeneral',
                calledMethod: 'getCities',
                methodProperties: {"Page": page.toString()}
            }, {headers: {'Content-Type': 'application/json'}});

            if (response.data.success === false) {
                await sleep(3000);
            } else {
                const cities = response.data?.data || [];

                if (cities.length === 0) break;

                page++;

                for (const city of cities) {
                    const dbCity = dbMap.get(city.Ref);

                    if (!dbCity) {
                        let shortType = ''
                        let shortTypeRU = ''
                        let cityType = 0;
                        if (city.SettlementTypeDescription === 'село') {
                            shortType = "c."
                            shortTypeRU = "c."
                            cityType = 3
                        } else if (city.SettlementTypeDescription === 'селище') {
                            shortType = "селище"
                            shortTypeRU = "поселок"
                            cityType = 2
                        } else if (city.SettlementTypeDescription === 'селище міського типу') {
                            shortType = "смт."
                            shortTypeRU = "пгт."
                            cityType = 1
                        } else if (city.SettlementTypeDescription === 'місто') {
                            shortType = "м."
                            shortTypeRU = "г."
                        }
                        const fullName = city.Description.includes("(") ? `${shortType} ${city.Description}` : `${shortType} ${city.Description} (${city.AreaDescription} обл)`
                        const fullName_ru = city.DescriptionRu.includes("(") ? `${shortType} ${city.DescriptionRu}` : `${shortType} ${city.DescriptionRu} (${city.AreaDescriptionRu} обл)`
                        await nova_poshta_cities.create({
                            name: city.Description,
                            name_ru: city.DescriptionRu,
                            fullName: fullName,
                            type: cityType,
                            fullName_ru: fullName_ru,
                            area: city.Area,
                            ref: city.Ref,
                        })
                    } else {
                        let shortType = ''
                        let shortTypeRU = ''
                        let cityType = 0;
                        if (city.SettlementTypeDescription === 'село') {
                            shortType = "c."
                            shortTypeRU = "c."
                            cityType = 3
                        } else if (city.SettlementTypeDescription === 'селище') {
                            shortType = "селище"
                            shortTypeRU = "поселок"
                            cityType = 2
                        } else if (city.SettlementTypeDescription === 'селище міського типу') {
                            shortType = "смт."
                            shortTypeRU = "пгт."
                            cityType = 1
                        } else if (city.SettlementTypeDescription === 'місто') {
                            shortType = "м."
                            shortTypeRU = "г."
                        }
                        const fullName = city.Description.includes("(") ? `${shortType} ${city.Description}` : `${shortType} ${city.Description} (${city.AreaDescription} обл.)`
                        const fullName_ru = city.DescriptionRu.includes("(") ? `${shortType} ${city.DescriptionRu}` : `${shortType} ${city.DescriptionRu} (${city.AreaDescriptionRu} обл.)`

                        if (dbCity.fullName !== fullName) {
                            await nova_poshta_cities.update({
                                name: city.Description,
                                name_ru: city.DescriptionRu,
                                fullName: fullName,
                                fullName_ru: fullName_ru,
                                type: cityType,
                                area: city.Area
                            }, {where: {ref: city.Ref}})
                        }

                        dbMap.delete(city.Ref); // позначаємо що місто актуальне
                    }
                }

                await sleep(300);
            }
        }

        // 4. Видалити ті, яких вже нема в API
        for (const [ref, dbCity] of dbMap) {
            await dbCity.destroy();
        }

        //-----------------------------
//         const allCities = await nova_poshta_cities.findAll()
//         let page = 1;
//
//         async function getCityList() {
//             const cities = await axios.post(process.env.NOVA_POSHTA_URL, {
//                 "apiKey": process.env.NOVA_POSHTA_API_KEY,
//                 "modelName": "AddressGeneral",
//                 "calledMethod": "getCities",
//                 "methodProperties": {
//                     "Page": page
//                 }
//             }, {
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//             })
//             outerLoop: for (const city of cities.data.data) {
//                 for (const oldCity of allCities) {
//                     if (city.Ref === oldCity.ref) {
//
//                         const fullName = city.Description.includes("(") ? `${shortType} ${city.Description}` : `${shortType} ${city.Description} (${city.AreaDescription} обл)`
//                         const fullName_ru = city.DescriptionRu.includes("(") ? `${shortType} ${city.DescriptionRu}` : `${shortType} ${city.DescriptionRu} (${city.AreaDescriptionRu} обл)`
//                         if (oldCity.fullName === fullName) {
//                             continue outerLoop;
//                         } else {
//                             await nova_poshta_cities.update({
//                                 name: city.Description,
//                                 name_ru: city.DescriptionRu,
//                                 fullName: fullName,
//                                 fullName_ru: fullName_ru,
//                                 area: city.Area
//                             }, {where: {ref: city.Ref}})
//                             continue outerLoop;
//                         }
//                     }
//                 }
//                 let shortType = ''
//                 let shortTypeRU = ''
//                 if (city.SettlementTypeDescription === 'село') {
//                     shortType = "c."
//                     shortTypeRU = "c."
//                 } else if (city.SettlementTypeDescription === 'селище') {
//                     shortType = "селище"
//                     shortTypeRU = "поселок"
//                 } else if (city.SettlementTypeDescription === 'селище міського типу') {
//                     shortType = "смт."
//                     shortTypeRU = "пгт."
//                 } else if (city.SettlementTypeDescription === 'місто') {
//                     shortType = "м."
//                     shortTypeRU = "г."
//                 }
//                 const fullName = city.Description.includes("(") ? `${shortType} ${city.Description}` : `${shortType} ${city.Description} (${city.AreaDescription} обл)`
//                 const fullName_ru = city.DescriptionRu.includes("(") ? `${shortType} ${city.DescriptionRu}` : `${shortType} ${city.DescriptionRu} (${city.AreaDescriptionRu} обл)`
//                 await nova_poshta_cities.create({
//                     name: city.Description,
//                     name_ru: city.DescriptionRu,
//                     fullName: fullName,
//                     fullName_ru: fullName_ru,
//                     area: city.Area,
//                     ref: city.Ref,
//                 })
//             }
//             if (cities.data.data.length === 150) {
//                 page++;
//                 setTimeout(async () => {
//                     await getCityList();
//                 }, 700);
//             } else if (cities.data.success === false) {
//                 setTimeout(async () => {
//                     await getCityList();
//                 }, 3000);
//             } else {
//                 TelegramMsg("TECH", 'Міста новой пошти оновлено')
//             }
//         }

        // await getCityList();

    } catch (e) {
        TelegramMsg("TECH", `renew nova city ${e.message}`)
    }
}, {
    timezone: 'Europe/Kyiv'
});

//renew nova_poshta_warehouses
cron.schedule('30 02 * * *', async () => {
    try {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        let page = 1;

        const allWarehousesDb = await nova_poshta_warehouses.findAll();
        const dbMap = new Map(allWarehousesDb.map(warehouse => [warehouse.warehouse_id, warehouse]));

        while (true) {
            const response = await axios.post(process.env.NOVA_POSHTA_URL, {
                apiKey: process.env.NOVA_POSHTA_API_KEY,
                modelName: 'AddressGeneral',
                calledMethod: 'getWarehouses',
                methodProperties: {"Page": page.toString(), "Limit": "1000"}
            }, {headers: {'Content-Type': 'application/json'}});

            if (response.data.success === false) {
                await sleep(3000);
            } else {
                const warehouses = response.data?.data || [];
                if (warehouses.length === 0) break;

                page++;

                for (const warehouse of warehouses) {
                    const dbWarehouse = dbMap.get(warehouse.Ref);

                    if (!dbWarehouse) {
                        const checkWH = await nova_poshta_warehouses.findOne({where: {warehouse_id: warehouse.Ref}});
                        if (!checkWH) {
                            await nova_poshta_warehouses.create({
                                status: warehouse.WarehouseStatus === "Working",
                                name: warehouse.Description.replace(' \"Нова Пошта\"', "").replace(/\s\([^)]*\)\s*:/g, ':'),
                                name_ru: warehouse.DescriptionRu.replace(' \"Новая Почта\"', "").replace(/\s\([^)]*\)\s*:/g, ':'),
                                cityRef: warehouse.CityRef,
                                warehouse_id: warehouse.Ref,
                                number: warehouse.Number,
                                type: warehouse.TypeOfWarehouse === "95dc212d-479c-4ffb-a8ab-8c1b9073d0bc" || warehouse.TypeOfWarehouse === "f9316480-5f2d-425d-bc2c-ac7cd29decf0" ? "P" : "W",
                                longitude: warehouse.Longitude,
                                latitude: warehouse.Latitude,
                                schedule: JSON.stringify(warehouse.Schedule),
                                index: warehouse.WarehouseIndex
                            })
                        }
                    } else {
                        if (warehouse.Description.replace(' \"Нова Пошта\"', "").replace(/\s\([^)]*\)\s*:/g, ':') !== dbWarehouse.name
                            || dbWarehouse.status !== (warehouse.WarehouseStatus === "Working") || warehouse.CityRef !== dbWarehouse.cityRef) {

                            await nova_poshta_warehouses.update({
                                status: warehouse.WarehouseStatus === "Working",
                                name: warehouse.Description
                                    .replace(' \"Нова Пошта\"', "")
                                    .replace(/\s\([^)]*\)\s*:/g, ':'),

                                name_ru: warehouse.DescriptionRu
                                    .replace(' \"Новая Почта\"', "")
                                    .replace(/\s\([^)]*\)\s*:/g, ':'),
                                cityRef: warehouse.CityRef,
                                number: warehouse.Number,
                                type: warehouse.TypeOfWarehouse === "95dc212d-479c-4ffb-a8ab-8c1b9073d0bc" || warehouse.TypeOfWarehouse === "f9316480-5f2d-425d-bc2c-ac7cd29decf0" ? "P" : "W",
                                longitude: warehouse.Longitude,
                                latitude: warehouse.Latitude,
                                schedule: JSON.stringify(warehouse.Schedule),
                                index: warehouse.WarehouseIndex
                            }, {where: {id: dbWarehouse.id}})
                        }

                        dbMap.delete(warehouse.Ref); // позначаємо що місто актуальне
                    }
                }

                await sleep(300);
            }
        }

        // 4. Видалити ті, яких вже нема в API
        for (const [ref, dbWarehouse] of dbMap) {
            await dbWarehouse.destroy();
        }

        //----------------------
        // const allWarehouses = await nova_poshta_warehouses.findAll()
        // let page = 1;
        //
        // async function getWarehousesList() {
        //     const warehouses = await axios.post(process.env.NOVA_POSHTA_URL, {
        //         "apiKey": process.env.NOVA_POSHTA_API_KEY,
        //         "modelName": "Address",
        //         "calledMethod": "getWarehouses",
        //         "methodProperties": {
        //             "Page": page, "Limit": "150"
        //         }
        //     }, {
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //     })
        //     outerLoop: for (const warehouse of warehouses.data.data) {
        //         if (warehouse.CityRef !== '00000000-0000-0000-0000-000000000000') {
        //             for (let i = 0; i < allWarehouses.length; i++) {
        //                 if (warehouse.Ref === allWarehouses[i].warehouse_id) {
        //                     if (warehouse.Description.replace(' \"Нова Пошта\"', "").replace(/\s\([^)]*\)\s*:/g, ':') === allWarehouses[i].name && allWarehouses[i].status === (warehouse.WarehouseStatus === "Working")) {
        //                         allWarehouses.splice(i, 1);
        //                         continue outerLoop;
        //                     } else {
        //                         await nova_poshta_warehouses.update({
        //                             status: warehouse.WarehouseStatus === "Working",
        //                             name: warehouse.Description
        //                                 .replace(' \"Нова Пошта\"', "")
        //                                 .replace(/\s\([^)]*\)\s*:/g, ':'),
        //
        //                             name_ru: warehouse.DescriptionRu
        //                                 .replace(' \"Новая Почта\"', "")
        //                                 .replace(/\s\([^)]*\)\s*:/g, ':'),
        //                             CityRef: warehouse.CityRef,
        //                             number: warehouse.Number,
        //                             type: warehouse.TypeOfWarehouse === "95dc212d-479c-4ffb-a8ab-8c1b9073d0bc" || warehouse.TypeOfWarehouse === "f9316480-5f2d-425d-bc2c-ac7cd29decf0" ? "P" : "W",
        //                             longitude: warehouse.Longitude,
        //                             latitude: warehouse.Latitude,
        //                             schedule: JSON.stringify(warehouse.Schedule),
        //                             index: warehouse.WarehouseIndex
        //                         }, {where: {warehouse_id: warehouse.Ref}})
        //                         allWarehouses.splice(i, 1);
        //                         continue outerLoop;
        //                     }
        //                 }
        //             }
        //             await nova_poshta_warehouses.create({
        //                 status: warehouse.WarehouseStatus === "Working",
        //                 name: warehouse.Description.replace(' \"Нова Пошта\"', ""),
        //                 name_ru: warehouse.DescriptionRu.replace(' \"Новая Почта\"', ""),
        //                 settlementRef: warehouse.SettlementRef,
        //                 warehouse_id: warehouse.Ref,
        //                 number: warehouse.Number,
        //                 type: warehouse.TypeOfWarehouse === "95dc212d-479c-4ffb-a8ab-8c1b9073d0bc" || warehouse.TypeOfWarehouse === "f9316480-5f2d-425d-bc2c-ac7cd29decf0" ? "P" : "W",
        //                 longitude: warehouse.Longitude,
        //                 latitude: warehouse.Latitude,
        //                 schedule: JSON.stringify(warehouse.Schedule),
        //                 index: warehouse.WarehouseIndex
        //             }).catch((e) => {
        //                 TelegramMsg("TECH", `create new warehouse ${e.message}`)
        //             })
        //         }
        //     }
        //     if (warehouses.data.data.length === 150) {
        //         page++;
        //         setTimeout(async () => {
        //             await getWarehousesList();
        //         }, 700);
        //     } else if (warehouses.data.success === false) {
        //         setTimeout(async () => {
        //             await getWarehousesList();
        //         }, 3000);
        //     } else {
        //         for (const warehouse of allWarehouses) {
        //             await nova_poshta_warehouses.update({status: false}, {where: {id: warehouse.id}})
        //         }
        //         TelegramMsg("TECH", 'Відділення новой пошти оновлено')
        //     }
        // }
        //
        // await getWarehousesList();
    } catch (e) {
        TelegramMsg("TECH", `renew nova warehouse ${e.message}`)
    }
}, {
    timezone: 'Europe/Kyiv'
});

//renew nova_poshta_streets
cron.schedule('50 02 * * *', async () => {
    try {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const allStreetsDb = await nova_poshta_streets.findAll();
        const dbMap = new Map(allStreetsDb.map(street => [street.ref, street]));

        const allCitiesDb = await nova_poshta_cities.findAll({attributes: ['ref']});
        for (const city of allCitiesDb) {
            let page = 1;
            while (true) {
                const response = await axios.post(process.env.NOVA_POSHTA_URL, {
                    apiKey: process.env.NOVA_POSHTA_API_KEY,
                    modelName: 'AddressGeneral',
                    calledMethod: 'getStreet',
                    methodProperties: {
                        "CityRef": city.ref,
                        "Page": page.toString(),
                        "Limit": "1000"
                    }
                }, {headers: {'Content-Type': 'application/json'}});

                if (response.data.success === false) {
                    await sleep(3000);
                } else {
                    const streets = response.data?.data || [];

                    if (streets.length === 0) break;

                    page++;

                    for (const street of streets) {
                        if (street.StreetsTypeRef === 'Village') continue;
                        const dbStreet = dbMap.get(street.Ref);

                        if (!dbStreet) {
                            const checkStreet = await nova_poshta_streets.findOne({where: {ref: street.Ref}});
                            if (!checkStreet) {
                                await nova_poshta_streets.create({
                                    name: `${street.StreetsType} ${street.Description}`,
                                    cityRef: city.ref,
                                    ref: street.Ref,
                                    type: street.StreetsType,
                                    typeRef: street.StreetsTypeRef,
                                })
                            }
                        } else {
                            if (dbStreet.name !== `${street.StreetsType} ${street.Description}`) {
                                await nova_poshta_streets.update({
                                    name: `${street.StreetsType} ${street.Description}`,
                                    cityRef: city.ref,
                                    ref: street.Ref,
                                    type: street.StreetsType,
                                    typeRef: street.StreetsTypeRef,
                                }, {where: {ref: street.Ref}})
                            }

                            dbMap.delete(street.Ref); // позначаємо що місто актуальне
                        }
                    }

                    await sleep(300);
                }
            }
        }

        // 4. Видалити ті, яких вже нема в API
        for (const [ref, dbStreet] of dbMap) {
            await dbStreet.destroy();
        }

        //----------------------
        // const allWarehouses = await nova_poshta_warehouses.findAll()
        // let page = 1;
        //
        // async function getWarehousesList() {
        //     const warehouses = await axios.post(process.env.NOVA_POSHTA_URL, {
        //         "apiKey": process.env.NOVA_POSHTA_API_KEY,
        //         "modelName": "Address",
        //         "calledMethod": "getWarehouses",
        //         "methodProperties": {
        //             "Page": page, "Limit": "150"
        //         }
        //     }, {
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //     })
        //     outerLoop: for (const warehouse of warehouses.data.data) {
        //         if (warehouse.CityRef !== '00000000-0000-0000-0000-000000000000') {
        //             for (let i = 0; i < allWarehouses.length; i++) {
        //                 if (warehouse.Ref === allWarehouses[i].warehouse_id) {
        //                     if (warehouse.Description.replace(' \"Нова Пошта\"', "").replace(/\s\([^)]*\)\s*:/g, ':') === allWarehouses[i].name && allWarehouses[i].status === (warehouse.WarehouseStatus === "Working")) {
        //                         allWarehouses.splice(i, 1);
        //                         continue outerLoop;
        //                     } else {
        //                         await nova_poshta_warehouses.update({
        //                             status: warehouse.WarehouseStatus === "Working",
        //                             name: warehouse.Description
        //                                 .replace(' \"Нова Пошта\"', "")
        //                                 .replace(/\s\([^)]*\)\s*:/g, ':'),
        //
        //                             name_ru: warehouse.DescriptionRu
        //                                 .replace(' \"Новая Почта\"', "")
        //                                 .replace(/\s\([^)]*\)\s*:/g, ':'),
        //                             CityRef: warehouse.CityRef,
        //                             number: warehouse.Number,
        //                             type: warehouse.TypeOfWarehouse === "95dc212d-479c-4ffb-a8ab-8c1b9073d0bc" || warehouse.TypeOfWarehouse === "f9316480-5f2d-425d-bc2c-ac7cd29decf0" ? "P" : "W",
        //                             longitude: warehouse.Longitude,
        //                             latitude: warehouse.Latitude,
        //                             schedule: JSON.stringify(warehouse.Schedule),
        //                             index: warehouse.WarehouseIndex
        //                         }, {where: {warehouse_id: warehouse.Ref}})
        //                         allWarehouses.splice(i, 1);
        //                         continue outerLoop;
        //                     }
        //                 }
        //             }
        //             await nova_poshta_warehouses.create({
        //                 status: warehouse.WarehouseStatus === "Working",
        //                 name: warehouse.Description.replace(' \"Нова Пошта\"', ""),
        //                 name_ru: warehouse.DescriptionRu.replace(' \"Новая Почта\"', ""),
        //                 settlementRef: warehouse.SettlementRef,
        //                 warehouse_id: warehouse.Ref,
        //                 number: warehouse.Number,
        //                 type: warehouse.TypeOfWarehouse === "95dc212d-479c-4ffb-a8ab-8c1b9073d0bc" || warehouse.TypeOfWarehouse === "f9316480-5f2d-425d-bc2c-ac7cd29decf0" ? "P" : "W",
        //                 longitude: warehouse.Longitude,
        //                 latitude: warehouse.Latitude,
        //                 schedule: JSON.stringify(warehouse.Schedule),
        //                 index: warehouse.WarehouseIndex
        //             }).catch((e) => {
        //                 TelegramMsg("TECH", `create new warehouse ${e.message}`)
        //             })
        //         }
        //     }
        //     if (warehouses.data.data.length === 150) {
        //         page++;
        //         setTimeout(async () => {
        //             await getWarehousesList();
        //         }, 700);
        //     } else if (warehouses.data.success === false) {
        //         setTimeout(async () => {
        //             await getWarehousesList();
        //         }, 3000);
        //     } else {
        //         for (const warehouse of allWarehouses) {
        //             await nova_poshta_warehouses.update({status: false}, {where: {id: warehouse.id}})
        //         }
        //         TelegramMsg("TECH", 'Відділення новой пошти оновлено')
        //     }
        // }
        //
        // await getWarehousesList();
    } catch (e) {
        TelegramMsg("TECH", `renew nova warehouse ${e.message}`)
    }
}, {
    timezone: 'Europe/Kyiv'
});

//renew ukr_city_list
cron.schedule('0 02 * * 1', async () => {
    try {
        const allCities = await ukr_poshta_cities.findAll()
        await axios.get(`https://www.ukrposhta.ua/address-classifier-ws/get_regions_by_region_ua`, {
            headers: {
                "Accept": "application/json", "Authorization": `Bearer ${process.env.UKR_POSHTA_BEARER_TOKEN}`,
            },
        }).then(async (regions) => {
            for (const region of regions.data.Entries.Entry) {
                await axios.get(`https://www.ukrposhta.ua/address-classifier-ws/get_districts_by_region_id_and_district_ua?region_id=${region.REGION_ID}`, {
                    headers: {
                        "Accept": "application/json", "Authorization": `Bearer ${process.env.UKR_POSHTA_BEARER_TOKEN}`,
                    },
                }).then(async (districts) => {
                    for (const district of districts.data.Entries.Entry) {

                        await axios.get(`https://www.ukrposhta.ua/address-classifier-ws/get_city_by_region_id_and_district_id_and_city_ua?district_id=${district.DISTRICT_ID}`, {
                            headers: {
                                "Accept": "application/json",
                                "Authorization": `Bearer ${process.env.UKR_POSHTA_BEARER_TOKEN}`,
                            },
                        }).then(async (cities) => {
                            if (cities.data.Entries?.Entry) {
                                outerLoop: for (const city of cities.data.Entries.Entry) {
                                    for (const oldCity of allCities) {
                                        if (city.CITY_ID === oldCity.city_id) {
                                            if (oldCity.fullName === `${city.SHORTCITYTYPE_UA} ${city.CITY_UA} (${city.DISTRICT_UA} р-н, ${city.REGION_UA} обл.)`) {
                                                continue outerLoop;
                                            } else {
                                                await ukr_poshta_cities.update({
                                                    name: city.CITY_UA,
                                                    fullName: `${city.SHORTCITYTYPE_UA} ${city.CITY_UA} (${city.DISTRICT_UA} р-н, ${city.REGION_UA} обл.)`,
                                                    region_id: city.REGION_ID,
                                                    district_id: city.DISTRICT_ID,
                                                    KATOTTG: city.CITY_KATOTTG,
                                                    population: city.POPULATION,
                                                    KOATUU: city.CITY_KOATUU,
                                                    longitude: city.LONGITUDE,
                                                    latitude: city.LATTITUDE
                                                }, {where: {city_id: city.CITY_ID}})
                                                continue outerLoop;
                                            }
                                        }
                                    }
                                    await ukr_poshta_cities.create({
                                        name: city.CITY_UA,
                                        fullName: `${city.SHORTCITYTYPE_UA} ${city.CITY_UA} (${city.DISTRICT_UA} р-н, ${city.REGION_UA} обл.)`,
                                        city_id: city.CITY_ID,
                                        region_id: city.REGION_ID,
                                        district_id: city.DISTRICT_ID,
                                        KATOTTG: city.CITY_KATOTTG,
                                        population: city.POPULATION,
                                        KOATUU: city.CITY_KOATUU,
                                        longitude: city.LONGITUDE,
                                        latitude: city.LATTITUDE
                                    })
                                }
                            }
                        })
                    }
                })
            }
            TelegramMsg("TECH", 'Міста укр пошти оновлено')
        })

    } catch (e) {
        TelegramMsg("TECH", `renew ukr city ${e.message}`)
        console.error(e);
    }
}, {
    timezone: 'Europe/Kyiv'
});

//test ukr_poshta_warehouses
cron.schedule('0 02 * * 2', async () => {
    try {
        const allWarehouses = await ukr_poshta_warehouses.findAll();
        const cities = await ukr_poshta_cities.findAll();
        const existingWarehousesMap = new Map(
            allWarehouses.map(w => [`${w.warehouse_id}-${w.city_id}`, w])
        );

        for (const city of cities) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await axios.get(
                `https://www.ukrposhta.ua/address-classifier-ws/get_postoffices_by_postcode_cityid_cityvpzid?city_koatuu=${city.KOATUU}`,
                {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${process.env.UKR_POSHTA_BEARER_TOKEN}`,
                    },
                }
            ).catch(error => {
                TelegramMsg(`Помилка запиту до міста укр пошта: ${error.response?.data?.message || error.message}`);
            })

            if (!response.data.Entries?.Entry) continue;

            const warehouses = Array.isArray(response.data.Entries.Entry)
                ? response.data.Entries.Entry
                : [response.data.Entries.Entry];


            for (const warehouse of warehouses) {
                const warehouseKey = `${warehouse.POSTOFFICE_ID}-${warehouse.CITY_VPZ_ID}`;
                const existingWarehouse = existingWarehousesMap.get(warehouseKey);
                const newWarehouseData = {
                    status: warehouse.LOCK_UA === 'Активний запис',
                    name: `№${warehouse.POSTOFFICE_UA.split(" ")[0]}, ${warehouse.STREET_UA_VPZ ? warehouse.STREET_UA_VPZ : warehouse.POSTOFFICE_UA_DETAILS}`,
                    index: warehouse.POSTINDEX,
                    postcode: warehouse.POSTCODE,
                    warehouse_id: warehouse.POSTOFFICE_ID,
                    type: "W",
                    city_id: warehouse.CITY_VPZ_ID,
                    longitude: warehouse.LONGITUDE,
                    latitude: warehouse.LATTITUDE,
                    type_acr: warehouse.TYPE_ACRONYM
                };

                if (existingWarehouse) {
                    const needsUpdate =
                        existingWarehouse.name !== newWarehouseData.name ||
                        existingWarehouse.status !== newWarehouseData.status ||
                        existingWarehouse.postcode !== newWarehouseData.postcode ||
                        existingWarehouse.index !== newWarehouseData.index;

                    if (needsUpdate) {
                        await ukr_poshta_warehouses.update(newWarehouseData, {
                            where: {
                                id: existingWarehouse.id
                            }
                        });
                    }
                } else {
                    // Double-check before create
                    const count = await ukr_poshta_warehouses.count({
                        where: {
                            warehouse_id: warehouse.POSTOFFICE_ID,
                            city_id: warehouse.CITY_VPZ_ID
                        }
                    });

                    if (count === 0) {
                        await ukr_poshta_warehouses.create(newWarehouseData);
                    }
                }
            }
        }

        await TelegramMsg("TECH", 'Відділення укр пошти оновлено');
    } catch (e) {
        await TelegramMsg("TECH", `renew ukr warehouse ${JSON.stringify(e)}`);
        console.error(e);
    }
}, {
    timezone: 'Europe/Kyiv'
});

//checkBox open shift
// cron.schedule('02 09 * * *', async () => {
//     try {
//         await Cashiers.findOne({
//             where: {id: 2}, include: [{model: FopsList}]
//         }).then(async cashier => {
//             if (cashier?.shift) {
//                 throw new Error("Зміну вже відкрито");
//             }
//             await CheckBox.statusShifts(cashier.fops_list.key, cashier.bearer).then(async (statusShift) => {
//                 if (statusShift.results.length === 0 || statusShift?.results[0]?.status === "CLOSED") {
//                     await CheckBox.shift(cashier.fops_list.key, cashier.bearer).then(async (openShifts) => {
//                         setTimeout(async () => {
//                             if (openShifts.status === "CREATED" || openShifts.status === "OPENED") {
//                                 await Cashiers.update({shift: true}, {where: {bearer: cashier.bearer}}).then(() => {
//                                     TelegramMsg("ORDER", `Автоматично відкрито зміну ${cashier.fops_list.name}`)
//                                 })
//                             } else {
//                                 throw new Error(`Зміна не відкрилася бо статус - ${openShifts.status}`);
//                             }
//                         }, 3000);
//                     })
//                 }
//             })
//         }).catch((error) => {
//             throw new Error(`Помилка в запиті до касира ${error.message}`);
//         });
//     } catch (error) {
//         TelegramMsg("TECH", `CheckBox auto open shift. ${error.message}`)
//     }
// }, {
//     timezone: 'Europe/Kyiv'
// });

//calculate score

// cron.schedule('0 05 * * *', async () => {
//     try {
//         const weights = {
//             rating: 5,        // Вага рейтингу  0-5
//             sales: 1,         // Вага продажів
//             reviews: 5,       // Вага відгуків
//             saleprice: 1,         // Вага знижки %
//         };
//
//         const devices = await Device.findAll({
//             where: {active: true}, attributes: ['id', 'rating', 'ratingCount', 'active', 'score', 'hit'], include: [{
//                 model: DeviceOptions,
//                 where: {saleprice: {[Op.gt]: 0}},
//                 limit: 1,
//                 attributes: ['count', 'price', 'saleprice'],
//             }]
//         });
//
//         for (const device of devices) {
//             const salesScore = await OrderDevice.count({
//                 where: {
//                     createdAt: {[Op.gte]: literal('CURRENT_TIMESTAMP - INTERVAL \'60 days\'')}
//                 },
//                 include: [{
//                     model: DeviceOptions, required: true, include: [{
//                         model: Device, required: true, where: {id: device.id}
//                     }]
//                 }]
//             });
//
//             const ratingScore = device.rating > 3 ? device.rating : 0;
//             const reviewsScore = device.ratingCount;
//             const priceScore = device.deviceoptions.length > 0 ? Math.round((1 - (device.deviceoptions[0].saleprice / device.deviceoptions[0].price)) * 100) : 0;
//
//             const finalScore = Math.round((ratingScore * weights.rating) + (salesScore * weights.sales) + (reviewsScore * weights.reviews) + (priceScore * weights.saleprice));
//             if (device.score !== finalScore || device.hit !== salesScore > 7) {
//                 await Device.update({score: finalScore, hit: salesScore > 7}, {where: {id: device.id}});
//             }
//         }
//     } catch (e) {
//         await TelegramMsg("TECH", `canculate score ${JSON.stringify(e)}`);
//         console.error(e);
//     }
// }, {
//     timezone: 'Europe/Kyiv'
// });

//checkBox close shift
if (process.env.NODE_ENV === "production") {
    cron.schedule('0,10,20,30,58,59 23 * * *', async () => {
        try {
            await Cashiers.findOne({
                where: {id: 1, shift: true}, include: [{model: FopsList}]
            }).then(async cashier => {
                if (cashier) {
                    await CheckBox.cashRegisterInfo(cashier.fops_list.key).then(async (dataShifts) => {
                        if (dataShifts.has_shift === true) {
                            await CheckBox.report(cashier.fops_list.key, cashier.bearer).then(async (info) => {
                                await CheckBox.serviceCash(info.balance * -1, cashier.fops_list.key, cashier.bearer).then(async () => {
                                    await CheckBox.closeShift(cashier.fops_list.key, cashier.bearer).then(async (close) => {
                                        if (close.status === "CLOSING") {
                                            await Cashiers.update({shift: false}, {where: {bearer: cashier.bearer}});
                                            await CheckBox.getOfflineCodesCount(cashier.fops_list.key, cashier.bearer).then(async (codeCount) => {
                                                if (Number(codeCount.available) < 1500) {
                                                    await CheckBox.getNewOfflineCodes(cashier.fops_list.key, cashier.bearer)
                                                }
                                                let payments = '';
                                                for (const payment of info.payments) {
                                                    payments += `${payment.label} - <b><u>${payment.sell_sum / 100} грн</u></b>\n`;
                                                }
                                                //
                                                TelegramMsg("ORDER", `Автоматично <b>закрито</b> зміну ${cashier.fops_list.name}.\nПробито чеків: <b>${info.sell_receipts_count}</b>\n${payments}\nКодів: <u>${codeCount.available}</u>`)
                                            })
                                        }
                                    })
                                })
                            })
                        }
                    })
                }
            }).catch((e) => {
                TelegramMsg("TECH", `CheckBox: Помилка отримання касира ${e.message}`)
            })
        } catch (e) {
            TelegramMsg("TECH", `close shiftlters ${e.message}`)
        }
    }, {
        timezone: 'Europe/Kyiv'
    });
}

//tracking post
if (process.env.NODE_ENV === "production") {
    try {
        cron.schedule('0 * * * *', async () => {
            const orders = await Orders.findAll({
                order: [["id", "DESC"]], attributes: ["status_id", 'postMethod', "id", "createdAt"], include: [{
                    model: DeliveryOrder,
                    attributes: ["ttn", 'mobile', 'deliveryDate', 'poshta_status_id'],
                    where: {ttn: {[Op.ne]: ""}},
                }, {
                    model: FopsList,
                    attributes: ["np_api_key", "ukr_tracking_token"]
                }], where: {
                    status_id: {[Op.in]: ['ready-delivery', 'delivery', 'ready-pickup', 'refused']},
                    createdAt: {[Op.gte]: literal('CURRENT_TIMESTAMP - INTERVAL \'30 days\'')}
                }
            })
            for (const orderElem of orders) {
                if (orderElem.postMethod.startsWith("np")) {
                    try {
                        const {data} = await axios.post(`${process.env.NOVA_POSHTA_URL}`, {
                            "apiKey": orderElem.fops_list.np_api_key,
                            "modelName": "TrackingDocument",
                            "calledMethod": "getStatusDocuments",
                            "methodProperties": {
                                "Documents": [{
                                    "DocumentNumber": orderElem.delivery_order.ttn,
                                    "Phone": orderElem.delivery_order.mobile
                                }]
                            }
                        }, {
                            headers: {
                                "Content-Type": "application/json"
                            },
                        })
                        if (data.success && data.errors.length === 0 && data.data?.[0]) {
                            const info = data.data[0];
                            if (orderElem.delivery_order.poshta_status_id !== info.StatusCode) {
                                await DeliveryOrder.update({
                                    poshta_status_id: info.StatusCode,
                                    ...(((!orderElem.delivery_order.deliveryDate && (info.StatusCode === "7" || info.StatusCode === "8"))) && {deliveryDate: Date.now()}),
                                    ...(((orderElem.delivery_order.deliveryDate && info.StatusCode === "104") && orderElem.delivery_order.poshta_status_id !== "104") && {deliveryDate: Date.now()})
                                }, {where: {orderId: orderElem.id}})

                                if (info.StatusCode === "2" || info.StatusCode === "3") {
                                    TelegramMsg("TECH", `Замовлення №${orderElem.id} має видалену чи невідому ТТН`)
                                }

                                if (info.StatusCode === "111") {
                                    TelegramMsg("TECH", `Замовлення №${orderElem.id}. Невдала спроба доставки через відсутність Одержувача на адресі або зв'язку з ним`)
                                }

                                let new_statusId;

                                if (info.StatusCode === "4" || info.StatusCode === "5" || info.StatusCode === "6" || info.StatusCode === "12"
                                    || info.StatusCode === "41" || info.StatusCode === "101" || info.StatusCode === "104") {
                                    new_statusId = orderElem.status_id === 'refused' || orderElem.status_id === 'refused-return' ? 'refused-return' : 'delivery';
                                } else if (info.StatusCode === "7" || info.StatusCode === "8") {
                                    new_statusId = orderElem.status_id === 'refused' || orderElem.status_id === 'refused-return' ? 'refused-return' : 'ready-pickup';
                                } else if (info.StatusCode === "1") {
                                    new_statusId = 'ready-delivery';
                                } else if (info.StatusCode === "9" || info.StatusCode === "10" || info.StatusCode === "11") {
                                    new_statusId = orderElem.status_id === 'refused' || orderElem.status_id === 'refused-return' ? 'refused-return' : 'completed';
                                } else if (info.StatusCode === "102" || info.StatusCode === "103" || info.StatusCode === "111") {
                                    new_statusId = 'refused';
                                }

                                if (new_statusId && new_statusId !== orderElem.status_id) {
                                    if (new_statusId === 'refused') {
                                        TelegramMsg("TECH", `Відмова від отримання: №${orderElem.id}`)
                                    }
                                    await Orders.update({
                                        status_id: new_statusId
                                    }, {where: {id: orderElem.id}})
                                } else if (!new_statusId) {
                                    TelegramMsg("TECH", `Не оброблений статус в замовленні №${orderElem.id} ТТН НП. Код: №${info.StatusCode}`)
                                }
                            }
                        } else {
                            throw new Error(data.errors?.[0])
                        }
                    } catch (error) {
                        TelegramMsg("TECH", `Нова пошта трекінг ${orderElem.id}. ${error?.message}`)
                        continue;
                    }
                }
                if (orderElem.postMethod.startsWith("ukr")) {
                    try {
                        let data;
                        try {
                            const response = await axios.get(`${process.env.UKR_POSHTA_TRACKING_URL}statuses/last?barcode=${orderElem.delivery_order.ttn}`, {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${orderElem.fops_list.ukr_tracking_token}`,
                                },
                            });
                            data = response.data;
                        } catch (error) {
                            if (error.response?.data?.message === 'Shipment not found') {
                                continue;
                            } else {
                                throw new Error(error.response?.data?.message || 'Unknown error');
                            }
                        }
                        if (data && data?.event) {
                            if (orderElem.delivery_order.poshta_status_id !== data.event) {
                                await DeliveryOrder.update({
                                    poshta_status_id: data.event,
                                    ...(((!orderElem.delivery_order.deliveryDate && data.event === "21700")) && {deliveryDate: Date.now()}),
                                    ...(((orderElem.delivery_order.deliveryDate && data.event === "31300")) && {deliveryDate: ""})
                                }, {where: {orderId: orderElem.id}})

                                if (data.event === "10603") {
                                    TelegramMsg("TECH", `Замовлення №${orderElem.id} має видалену ТТН. Укрпошта`)
                                }

                                if (data.event === "31300") {
                                    TelegramMsg("TECH", `Замовлення №${orderElem.id} змінено адресу. ТТН: ${orderElem.delivery_order.ttn}. Укрпошта`)
                                }

                                let new_statusId;

                                if (data.event === "20700" || data.event === "20800" || data.event === "20900"
                                    || data.event === "21500" || data.event === "31100" || data.event === "10100") {
                                    new_statusId = orderElem.status_id === 'refused' || orderElem.status_id === 'refused-return' ? 'refused' : 'delivery';
                                } else if (data.event === "21700") {
                                    new_statusId = orderElem.status_id === 'refused' || orderElem.status_id === 'refused-return' ? 'refused-return' : 'ready-pickup';
                                } else if (data.event === "41000" || data.event === "48000") {
                                    new_statusId = orderElem.status_id === 'refused' || orderElem.status_id === 'refused-return' ? 'refused-return' : 'completed';
                                } else if (data.event === "31200" || data.event === "10600" || data.event === "10602") {
                                    new_statusId = 'refused';
                                }

                                if (data.event === "20800" && orderElem.delivery_order.poshta_status_id === "21700") {
                                    TelegramMsg("TECH", `Замовлення №${orderElem.id} схоже пропустили статус відмови. ТТН: ${orderElem.delivery_order.ttn}. Укрпошта`)
                                }

                                if (new_statusId && new_statusId !== orderElem.status_id) {
                                    if (new_statusId === 'refused') {
                                        TelegramMsg("TECH", `Відмова від отримання: №${orderElem.id}`)
                                    }
                                    await Orders.update({
                                        status_id: new_statusId
                                    }, {where: {id: orderElem.id}})
                                } else if (!new_statusId) {
                                    TelegramMsg("TECH", `Не оброблений статус в замовленні №${orderElem.id} ТТН УКР пошта. Код: №${data.event}`)
                                }
                            }
                        } else {
                            TelegramMsg(`Немає статусу УКР ПОШТА ${orderElem.id}`)
                        }

                    } catch (error) {
                        TelegramMsg("TECH", `Укр пошта трекінг ${orderElem.id}. ${error.message}`)
                        continue;
                    }
                }

                if (new Date().getHours() === 10 && orderElem.status_id === 'ready-pickup' && orderElem.delivery_order.deliveryDate) {
                    const deliveryDate = new Date(+orderElem.delivery_order.deliveryDate);
                    const now = new Date();
                    deliveryDate.setHours(0, 0, 0, 0);
                    now.setHours(0, 0, 0, 0);
                    const diffDays = Math.floor((now - deliveryDate) / (1000 * 60 * 60 * 24));
                    if (diffDays === 5) {
                        TelegramMsg("ORDER", `Замовлення на пошті 5 днів: №${orderElem.id}`);
                    }
                }
            }
        }, {
            timezone: 'Europe/Kyiv'
        });
    } catch (error) {
        TelegramMsg("TECH", `tracking post ${error.message}`)
    }
}

app.use(cors());

app.post('/webhook/mono', express.raw({type: 'application/json'}), async (req, res) => {
    const message = JSON.parse(req.body.toString('utf8'));
    let pubKeyBase64 = process.env.MONO_WEBHOOK_KEY;
    let xSignBase64 = req.get('X-Sign');
    let signatureBuf = Buffer.from(xSignBase64, 'base64');
    let publicKeyBuf = Buffer.from(pubKeyBase64, 'base64');
    let verify = crypto.createVerify('SHA256');
    verify.write(req.body);
    verify.end();
    let result = verify.verify(publicKeyBuf, signatureBuf);
    res.status(200).send('Дані успішно отримано');
    if (result) {

        await PaymentOrder.findOne({
            where: {invoiceId: message.invoiceId}
        }).then(async (paymentOrder) => {
            if (paymentOrder) {
                if (paymentOrder.lastInvoiceUpdate == null || (Date.parse(message.modifiedDate) > Date.parse(paymentOrder.lastInvoiceUpdate))) {
                    PaymentOrder.update({
                        status: message.status === 'failure' ? 'failure'
                            : message.status === 'success' ? 'paid'
                                : message.status === 'expired' ? 'expired'
                                    : message.status === 'reversed' ? 'reversed'
                                        : paymentOrder.status,
                        lastInvoiceUpdate: message.modifiedDate,
                        sub_status: message.status === 'failure' ? message.errCode : message.status,
                    }, {where: {id: paymentOrder.id}})
                    if(message.status === 'success'){
                        TelegramMsg("ORDER", `Отримана оплата через МоноБанк - замовлення №${paymentOrder.orderId}`)
                    }else if(message.status === 'failure'){
                        TelegramMsg("TECH", `${JSON.stringify(message)}`)
                    }
                }
            }
        });
    } else {
        TelegramMsg("TECH", `Моно Хук не верифіковано або Закінчився ключ!!!!(/api/merchant/pubkey) або якась собака прокидує запити на оплату.\n ${JSON.stringify(message)}`)
    }
});

app.use(express.json());

// app.use(fileUpload({}));
app.use('/api', router);
//Handler error, last middleware
if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
        next();
    });
    app.use(express.static(path.resolve(__dirname, 'public')));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "public", "index.html"));
    });
} else {
    app.use(express.static(path.resolve(__dirname, 'static')));
}

app.post('/webhook/privat-part-payments', async (req, res) => {
    const body = req.body;
    const privat_key = process.env.NODE_ENV === "production" ? process.env.PRIVAT_PART_PAYMENT_KEY : process.env.DEV_PRIVAT_PART_PAYMENT_KEY;
    const privat_store_id = process.env.NODE_ENV === "production" ? process.env.PRIVAT_STORE_ID : process.env.DEV_PRIVAT_STORE_ID;
    if (!body) {
        res.status(500).send('Body Error');
    }
    res.status(200).send('Дані успішно отримано');
    TelegramMsg("TECH", `Оплата частинами приват. ${JSON.stringify(body)}`)


    function generateSignature() {
        const raw = privat_key + privat_store_id + body.orderId + body.paymentState + body.message + privat_key;
        const sha1 = crypto.createHash('sha1').update(raw).digest();
        return sha1.toString('base64');
    }

    //{
    //   orderId: 'Lamiya-1749499229694',
    //   paymentState: 'SUCCESS',
    //   signature: 'TDGgdR4YRF7cD0Q+ZOy6ShnT5lA=',
    //   message: "Я ПІБ, ЗАГАЛЬНОЦИВІЛЬНИЙ ПАСПОРТ ПІДТВЕРДЖУЮ ЗОБОВ'ЯЗАННЯ ЗА ДОГОВОРОМ І ПОРУЧАЮ БАНКУ ВСТАНОВИТИ РЕГУЛЯРНИЙ ПЛАТІЖ З КАРТИ № 0000********3333 НА ПОГАШЕННЯ ЗАБОРГОВАННОСТІ ПО ДОГОВОРУ. КІЛЬКІСТЬ ПЛАТЕЖІВ: . ЩОМІСЯЧНИЙ ПЛАТІЖ UAH. З УМОВАМИ ТА ПРАВИЛАМИ НАДАННЯ БАНКІВСЬКИХ ПОСЛУГ НА WWW.PRIVATBANK.UA ОЗНАЙОМЛЕНИЙ ТА ПОГОДЖУЮСЬ",
    //   storeId: '4AAD1369CF734B64B70F'
    // }

    if (generateSignature() === body.signature) {
        const payment = await PaymentOrder.findOne({where: {invoiceId: body.orderId}});
        if (payment) {
            let status = payment.status;

            if (payment.status !== 'paid' && body.paymentState === 'SUCCESS') {
                status = 'paid'
                TelegramMsg("ORDER", `Отримана оплата частинами Приват - замовлення №${payment.orderId}`)
            }else if(body.paymentState === 'FAIL'){
                status = 'failure'
                TelegramMsg("ORDER", `Помилка оплати частинами Приват - замовлення №${payment.orderId}`)
            }
            await PaymentOrder.update({
                status,
                sub_status: body.paymentState,
                lastInvoiceUpdate: Date.now()
            }, {where: {id: payment.id}});
            TelegramMsg("TECH", `Зміна Sub_status ПЧ приват в замовленні:${payment.orderId} з ${payment.sub_status} на ${body.paymentState}. Статус: ${payment.status} на ${status}`)
        } else {
            TelegramMsg("TECH", `Не знайшли замовлення для оплати частинами приват ${body.orderId}`)
        }
    } else {
        TelegramMsg("TECH", `Приват Хук оплати частинами не верифіковано.`)
    }
});

app.post('/webhook/mono-part-payments', async (req, res) => {
    const body = req.body;
    const signature = req.headers['signature']
    const mono_key = process.env.NODE_ENV === "production" ? process.env.MONO_PART_PAYMENT_KEY : process.env.DEV_PART_PAYMENT_KEY;
    if (!body || !signature) {
        res.status(500).send('Server Error');
    }
    res.status(200).send('Дані успішно отримано');

    function signRequest() {
        const hmac = crypto.createHmac('sha256', Buffer.from(mono_key, 'utf-8'));
        hmac.update(JSON.stringify(body), 'utf8');
        return hmac.digest('base64');
    }

    TelegramMsg("TECH", `Оплата частинами моно. ${JSON.stringify(body)}`)

    if (signRequest() === signature) {
        const payment = await PaymentOrder.findOne({where: {invoiceId: body.order_id}});
        if (payment) {
            let status = payment.status;
            if (body.state === 'IN_PROCESS' && payment.status !== 'paid' && body.order_sub_state === 'WAITING_FOR_STORE_CONFIRM') {
                status = 'paid';
                await MonoPartPayments.confirmSendOrderToUser({order_id: payment.invoiceId}).catch(async error => {
                    await TelegramMsg("TECH", `Оплата отримана, але не підтверджена видача!!! Повторити спробу. Замовлення: №${payment.orderId}`);
                }).then(async data => {
                    if (data.state === 'SUCCESS') {
                        await TelegramMsg("ORDER", `Отримана оплата частинами через Моно, та підтверджена видача - замовлення №${payment.orderId}`)
                    } else {
                        await TelegramMsg("ORDER", `Невідомий статус оплати частинами. ${JSON.stringify(data)}`)
                    }
                })
            } else if (body.state === 'FAIL') {
                status = 'failure';
            } else if (body.state === 'IN_PROCESS') {
                status = 'processing';
            }

            // if (body.order_sub_state === 'WRONG_CLIENT_APP_VERSION') {
            //     error_status = "Помилка: Клієнт має застарілу версію додатку"
            // } else if (body.order_sub_state === 'CLIENT_NOT_FOUND') {
            //     error_status = `Помилка: Клієнта не знайдено`
            // } else if (body.order_sub_state === 'EXCEEDED_SUM_LIMIT') {
            //     error_status = `Помилка: Перевищено ліміт на ПЧ`
            // } else if (body.order_sub_state === 'ACCOUNT_CLOSED') {
            //     error_status = `Помилка: Акаунт закрито`
            // } else if (body.order_sub_state === 'PAY_PARTS_ARE_NOT_ACCEPTABLE') {
            //     error_status = `Помилка: Із цією кількістю платежів клієнт не може оформити розстрочку`
            // } else if (body.order_sub_state === 'EXISTS_OTHER_OPEN_ORDER') {
            //     error_status = `Помилка: У клієнта є інша відкрита заявка на ПЧ. Чекати 15 хв`
            // } else if (body.order_sub_state === 'NOT_ENOUGH_MONEY_FOR_INIT_DEBIT') {
            //     error_status = `Помилка: Недостатньо коштів для першого списання`
            // } else if (body.order_sub_state === 'CLIENT_PUSH_TIMEOUT') {
            //     error_status = `Помилка: Клієнт не ухвалив рішення у застосунку`
            // } else if (body.order_sub_state === 'CONFIRM_TIME_EXPIRED') {
            //     error_status = `Помилка: Минув час підтвердження заявки клієнтом`
            // } else if (body.order_sub_state === 'REJECTED_BY_CLIENT') {
            //     error_status = `Помилка: Клієнт відмовився від здійснення покупки`
            // } else if (body.order_sub_state === 'REJECTED_BY_STORE') {
            //     error_status = `Помилка: Магазин відмовився від продажу`
            // } else if (body.order_sub_state === 'FAIL') {
            //     error_status = `Помилка: Внутрішня помилка на боці Банку`
            // }else if (body.order_sub_state === 'RESTRICTED_BY_RISKS') {
            //     error_status = `Помилка: Потрібно звернутися до банку для отримання причини відмови`
            // }else{
            //     TelegramMsg("TECH", `Невідомий статус помилки ПЧ:№${body.order_id} код:${body.order_sub_state}`)
            // }

            await PaymentOrder.update({
                status,
                sub_status: body.order_sub_state,
                lastInvoiceUpdate: Date.now()
            }, {where: {id: payment.id}});
            TelegramMsg("TECH", `Зміна Sub_status ПЧ в замовленні:${payment.orderId} з ${payment.sub_status} на ${body.order_sub_state}. Статус: ${payment.status} на ${status}`)
        } else {
            TelegramMsg("TECH", `Не знайшли замовлення для оплати частинами ${body.order_id}`)
        }
    } else {
        TelegramMsg("TECH", `Моно Хук оплати частинами не верифіковано. ${JSON.stringify(body)}`)
    }
});


app.use(errorHandler);
const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        // connection.connect();

        app.listen(port, () => {
            console.log(`App listening at https://${host}:${port}`);
        });
    } catch (e) {
        console.error(e);
    }
}
start();
