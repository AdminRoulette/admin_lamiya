const Router = require('express');
const router = new Router();
const monoController = require('../controllers/monoController');
const checkRole = require("../middleware/checkRoleMiddleware");



router
    .get('/get-fop-payments',checkRole("ADMIN"), monoController.getFopPayments)
    .post('/check-phone',checkRole("ADMIN,SELLER"), monoController.CheckPhone)



module.exports = router;