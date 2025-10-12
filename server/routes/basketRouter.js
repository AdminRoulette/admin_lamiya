const Router = require('express');
const router = new Router();
const BasketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');
const checkDeleteDeviceFromBasket = require('../middleware/checkDeleteDeviceFromBasket');
const checkRole = require("../middleware/checkRoleMiddleware");



router
    .post('/userBasket', authMiddleware, BasketController.getUserBasketDevices)
    //valid

    .post('/', checkRole("ADMIN,SELLER"), BasketController.addDevice)
    .delete('/delete/:deviceoptionId', authMiddleware, checkDeleteDeviceFromBasket, BasketController.deleteDevice)
    .delete('/all', checkRole("ADMIN"), BasketController.deleteAll)
    .post('/changeCount', authMiddleware, BasketController.changeCount)
    .post('/barcode-to-basket', checkRole("ADMIN,SELLER"), BasketController.BarcodeToBasket)


module.exports = router;
