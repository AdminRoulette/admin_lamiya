const Router = require('express');
const router = new Router();
const financeController = require('../controllers/financeController');
const checkRole = require('../middleware/checkRoleMiddleware');

router
    .get('/get-list', checkRole("ADMIN"), financeController.getFopsList)
    .get('/collection', checkRole("ADMIN"), financeController.getCollection)
    .post('/create-collection', checkRole("ADMIN"), financeController.createCollection)
    .get('/get-fops-list', checkRole("ADMIN"), financeController.getFopsList)
    .post('/create-fop', checkRole("ADMIN"), financeController.createFop)
    .post('/edit-fop', checkRole("ADMIN"), financeController.editFop)
    .post('/create-expenses',checkRole("ADMIN"), financeController.createExpenses)
    .put('/update-expenses',checkRole("ADMIN"), financeController.updateExpenses)
    .get('/get-expenses-list', checkRole("ADMIN"), financeController.getAllExpenses)
module.exports = router;