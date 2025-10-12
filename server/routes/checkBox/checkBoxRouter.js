const Router = require('express');
const router = new Router();
const CheckBoxController = require('../../controllers/CheckBox/CheckBoxController');
const checkRole = require('../../middleware/checkRoleMiddleware');

router
    .post('/open-shift',checkRole("ADMIN,SELLER"), CheckBoxController.OpenShift)
    .post('/close-shift',checkRole("ADMIN,SELLER"), CheckBoxController.CloseShift)
    .get('/check-shift',checkRole("ADMIN,SELLER"), CheckBoxController.CheckShift)
    .post('/set-cashier-bearer',checkRole("ADMIN"), CheckBoxController.SetCashierBearer)
    .post('/create-check',checkRole("ADMIN,SELLER"), CheckBoxController.CreateOrderCheck)
    .get('/shift-stats',checkRole("ADMIN,SELLER"), CheckBoxController.ShiftStats)

module.exports = router;