const Router = require('express');
const router = new Router();

const supplyController = require('../controllers/supplyController');
const checkRole = require('../middleware/checkRoleMiddleware');

router
    .get('/get-list', checkRole("ADMIN"), supplyController.getSupplyList)
    .get('/get-supply-long-info', checkRole("ADMIN"), supplyController.getSupplyLongInfo)
    .get('/get-products', checkRole("ADMIN"), supplyController.getProducts)
    .post('/add-product', checkRole("ADMIN"), supplyController.addProductToSupply)
    .put('/edit-product', checkRole("ADMIN"), supplyController.editProductToSupply)
    .post('/create', checkRole("ADMIN"), supplyController.CreateSupply)
    .post('/approve', checkRole("ADMIN"), supplyController.ApproveSupply)
    .post('/edit', checkRole("ADMIN"), supplyController.EditSupply)
    .delete('/delete-product', checkRole("ADMIN"), supplyController.deleteProductSupply)
    .get('/print-supply-excel', checkRole("ADMIN"), supplyController.PrintSupplyExcel)

module.exports = router;