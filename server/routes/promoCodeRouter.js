const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const promoCodesController = require('../controllers/promoCodesController')
const checkRole = require("../middleware/checkRoleMiddleware");


router
    .get('/',  checkRole("ADMIN"), promoCodesController.getAllPromoCodes)
    .post('/',  checkRole("ADMIN"), promoCodesController.createPromoCode)
    .get('/onePromo',  checkRole("ADMIN"), promoCodesController.getOnePromoCodes)
    .post('/check', checkRole("ADMIN,SELLER"), promoCodesController.checkPromoCode)


module.exports = router;