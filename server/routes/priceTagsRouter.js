const Router = require('express');
const router = new Router();
const priceTagsController = require('../controllers/priceTagsController');
const checkRole = require('../middleware/checkRoleMiddleware');

router
    .get('/get-all', checkRole("ADMIN,SELLER"), priceTagsController.getAllPriceTags)
    .post('/printing-excel', checkRole("ADMIN,SELLER"), priceTagsController.printingExcelTags)

module.exports = router;