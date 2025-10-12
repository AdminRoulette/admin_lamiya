const Router = require('express');
const router = new Router();
const accountingController = require('../controllers/accountingController');
const checkRole = require('../middleware/checkRoleMiddleware');

router
    .get('/stock', checkRole("ADMIN"), accountingController.accountingStock)
    .get('/money', checkRole("ADMIN"), accountingController.calculateMoney)
    .get('/revenue', checkRole("ADMIN"), accountingController.revenue)
    .get('/analytics', checkRole("ADMIN"), accountingController.getAnalytics)
    .get('/lose', checkRole("ADMIN"), accountingController.getMoneyLose)

module.exports = router;