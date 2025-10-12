const axios = require("axios");
const apiError = require("../error/apierror");
const TelegramMsg = require("../functions/TelegramMsg");
const {Op, literal} = require("sequelize");
const {CityList, WarehouseNPList, OrderDevice, DeviceOptions, Device, ParfumePart, Brand, nova_poshta_cities,
    nova_poshta_warehouses, ukr_poshta_cities, ukr_poshta_warehouses, nova_poshta_streets
} = require("../models/models");

class AddressesController {

    async getCityList(req, res, next) {
        try {
            let arrayCityList = [];
            const {name, provider} = req.query;
            const language = req.query.language === 'true';
            if (provider.startsWith('np')) {
                await nova_poshta_cities.findAll({
                    order: [['type', 'ASC']],
                    include: [{
                        model: nova_poshta_warehouses,
                        attributes: [],
                        where: {type: provider === 'np_w' ? "W" : "P"},
                        required: true
                    }],
                    where: {
                        [Op.or]: [{name: {[Op.iLike]: `%${name}%`}}, {name_ru: {[Op.iLike]: `%${name}%`}}]
                    }
                }).then((cities) => {
                    for (const city of cities) {
                        arrayCityList.push({
                            name: language ? city.fullName_ru : city.fullName, ref: city.ref
                        });
                    }
                    return res.json(arrayCityList);
                });
            } else {
                await ukr_poshta_cities.findAll({
                    order: [['population', 'DESC']], include: [{model: ukr_poshta_warehouses, required: true}], where: {
                        [Op.or]: [{name: {[Op.iLike]: `%${name}%`}},]
                    }
                }).then((cities) => {
                    for (const city of cities) {
                        arrayCityList.push({
                            name: city.fullName, city_id: city.city_id
                        });
                    }
                    return res.json(arrayCityList);
                });
            }
        } catch (e) {
            TelegramMsg("TECH", `getCityList ${e.message}`)
            return next(apiError.badRequest(e.message));
        }

    }

    async getStreetList(req, res, next) {
        try {
            let arrayStreetList = [];
            const {cityRef, name} = req.query;

            await nova_poshta_streets.findAll({
                order: [['name', 'ASC']],
                where: {cityRef: cityRef, name: {[Op.iLike]: `%${name}%`}}, limit: 50
            }).then((streets) => {
                for (const street of streets) {
                    arrayStreetList.push({
                        name: street.name, street_ref: street.ref
                    });
                }
                return res.json(arrayStreetList);
            });

        } catch (e) {
            TelegramMsg("TECH", `getStreetList ${e.message}`)
            return next(apiError.badRequest(e.message));
        }
    }

    async getDefaultCity(req, res, next) {
        try {
            let language = req.query.language === 'true';

            const npList = ['8d5a980d-391c-11dd-90d9-001a92567626', 'db5c88f5-391c-11dd-90d9-001a92567626', 'db5c88d0-391c-11dd-90d9-001a92567626',
                'db5c88f0-391c-11dd-90d9-001a92567626', 'db5c88e0-391c-11dd-90d9-001a92567626', 'db5c88ac-391c-11dd-90d9-001a92567626',
                'db5c8900-391c-11dd-90d9-001a92567626', 'db5c8902-391c-11dd-90d9-001a92567626', 'db5c896a-391c-11dd-90d9-001a92567626',
                'db5c8892-391c-11dd-90d9-001a92567626', 'db5c88c6-391c-11dd-90d9-001a92567626', 'db5c890d-391c-11dd-90d9-001a92567626'];
            const ukrList = ['29713', '14288', '17069', '3641', '27760', '19234', '20296', '22662', '24550', '26481', '4292', '8968'];
            let citiesNpList = []
            let citiesUkrList = []
            await nova_poshta_cities.findAll({
                order: [[literal(`array_position(ARRAY[${npList.map(ref => `'${ref}'`).join(', ')}], nova_poshta_cities.ref)`)]],
                where: {ref: {[Op.in]: npList}}
            })
                .then(cities => {
                    for (const city of cities) {
                        citiesNpList.push({
                            name: language ? city.fullName_ru : city.fullName, ref: city.ref
                        })
                    }
                })
            await ukr_poshta_cities.findAll({
                order: [[literal(`array_position(ARRAY[${ukrList.map(city_id => `'${city_id}'`).join(', ')}], ukr_poshta_cities.city_id)`)]],
                where: {city_id: {[Op.in]: ukrList}}
            })
                .then(cities => {
                    for (const city of cities) {
                        citiesUkrList.push({
                            name: city.fullName, city_id: city.city_id
                        })
                    }
                })
            return res.json([citiesNpList, citiesUkrList]);
        } catch (e) {
            TelegramMsg("TECH", `getDefaultCity ${e.message}`)
            return next(apiError.badRequest(e.message));
        }
    }

    async getWarehouseList(req, res, next) {
        try {
            let arrayWarehouseList = [];
            const {cityRef, provider} = req.query;
            let language = req.query.language === 'true';
            if (provider.startsWith('np')) {
                await nova_poshta_warehouses.findAll({
                    order: [['number', 'ASC']],
                    where: {cityRef: cityRef, type: provider === 'np_w' ? "W" : "P", status: true}
                }).then((warehouses) => {
                    for (const warehouse of warehouses) {
                        arrayWarehouseList.push({
                            name: language ? warehouse.name_ru : warehouse.name, warehouse_id: warehouse.warehouse_id
                        });
                    }
                    return res.json(arrayWarehouseList);
                });
            } else {
                await ukr_poshta_warehouses.findAll({
                    order: [['index', 'ASC']], where: {city_id: cityRef, status: true}
                }).then((warehouses) => {
                    for (const warehouse of warehouses) {
                        arrayWarehouseList.push({
                            name: warehouse.name, warehouse_id: warehouse.index
                        });
                    }
                    return res.json(arrayWarehouseList);
                });
            }
        } catch (e) {
            TelegramMsg("TECH", `getWarehouseList ${e.message}`)
            return next(apiError.badRequest(e.message));
        }
    }

}

module.exports = new AddressesController();
