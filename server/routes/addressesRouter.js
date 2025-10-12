const Router = require('express');
const addressesController = require("../controllers/addressesController");
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');

router

    .get('/get-city-list', checkRole("ADMIN,SELLER"), addressesController.getCityList)
    .get('/get-warehouse-list', checkRole("ADMIN,SELLER"), addressesController.getWarehouseList)
    .get('/get-default-city', checkRole("ADMIN,SELLER"), addressesController.getDefaultCity)
    .get('/get-street-list', checkRole("ADMIN,SELLER"), addressesController.getStreetList)
    // .post('/getDelPrice', novaPoshtaController.getDeliveryPrice)
    // .post('/getDelPrice', ukrPoshtaController.getDeliveryPrice)

module.exports = router;