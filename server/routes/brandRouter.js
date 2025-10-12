const Router = require('express');
const router = new Router();
const brandController = require('../controllers/brandController');
const checkRole = require('../middleware/checkRoleMiddleware');

router
    .post('/', checkRole("ADMIN"), brandController.create)
    .post('/edit', checkRole("ADMIN"), brandController.edit)
    .get('/', checkRole("ADMIN,AUTHOR"), brandController.getAll)

module.exports = router;
