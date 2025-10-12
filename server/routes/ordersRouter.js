const Router = require('express');
const router = new Router();

const ordersController = require('../controllers/ordersController');
const cancelOrder = require('../controllers/Orders/cancelOrder');
const adminOrders = require('../controllers/Orders/adminOrders');
const checkRole = require('../middleware/checkRoleMiddleware');

router
    .post('/cancel', checkRole("ADMIN"), cancelOrder.cancel)
    .get('/get-order-info-edit/:id', checkRole("ADMIN,SELLER"), ordersController.getOrderEdit)
    .put('/edit-product', checkRole("ADMIN,SELLER"), ordersController.editOrder)
    .put('/approval-payment', checkRole("ADMIN,SELLER"), ordersController.ApprovalPayment)
    .get('/getList/:type', checkRole("ADMIN,SELLER"), ordersController.getAdminOrderList)
    .put('/create-ttn', checkRole("ADMIN,SELLER"), adminOrders.completeOrder)
    .put('/edit-privacy_comment', checkRole("ADMIN,SELLER"), adminOrders.ChangePrivacyComment)
    .put('/packing-status', checkRole("ADMIN,SELLER"), adminOrders.PackingStatus)
    .put('/delivery-ready', checkRole("ADMIN,SELLER"), adminOrders.DeliveryReady)
    .put('/complete-real-status', checkRole("ADMIN,SELLER"), adminOrders.CompleteRealStatus)
    .put('/create-real-order', checkRole("ADMIN,SELLER"), adminOrders.CompleteRealOrder)
    .put('/OrderWithOutPRRO', checkRole("ADMIN"), adminOrders.OrderWithOutPRRO)
    .get('/create',checkRole("ADMIN,SELLER"), adminOrders.CreateOrder)
    .get('/get-zebra-ttn',checkRole("ADMIN,SELLER"), adminOrders.getZebraTTN)
//

module.exports = router;
