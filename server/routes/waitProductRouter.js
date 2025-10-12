const Router = require('express');
const router = new Router();
const waitProductController = require('../controllers/waitProductController');
const checkRole = require('../middleware/checkRoleMiddleware');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
router
    .post('/add', checkRole("ADMIN,SELLER"), waitProductController.add)
    .post('/edit', checkRole("ADMIN,SELLER"), waitProductController.edit)
    .get('/', checkRole("ADMIN,SELLER"), waitProductController.getAllList)
    .get('/wish', checkRole("ADMIN"), waitProductController.getUserWishList)
    .delete('/:id', checkRole("ADMIN,SELLER"), waitProductController.delete)

//
module.exports = router;