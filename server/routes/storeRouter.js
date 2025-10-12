const Router = require('express');
const router = new Router();
const storeController = require('../controllers/storeController');
const checkRole = require('../middleware/checkRoleMiddleware');

router
    .post('/', checkRole("ADMIN"), storeController.create)
    .post('/edit', checkRole("ADMIN"), storeController.edit)
    .get('/', checkRole("ADMIN"), storeController.getAll)

module.exports = router;
