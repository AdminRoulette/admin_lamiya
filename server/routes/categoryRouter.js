const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/categoryController');
const checkRole = require('../middleware/checkRoleMiddleware');

router
    .post('/', checkRole("ADMIN"), categoryController.createCategory)
    .put('/', checkRole("ADMIN"), categoryController.editCategory)
    .delete('/', checkRole("ADMIN"), categoryController.deleteCategory)

    .get('/all', checkRole("ADMIN,AUTHOR"), categoryController.getAll)
    .get('/linked', checkRole("ADMIN,FILTER"), categoryController.getAllLinked)
    .get('/filters', checkRole("ADMIN,AUTHOR,SELLER"), categoryController.getFiltersCategory)


module.exports = router;
