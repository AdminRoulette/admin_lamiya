const Router = require('express');
const router = new Router();
const CreateProduct = require('../controllers/Product/CreateProduct');
const deviceController = require('../controllers/Product/deviceController');
const checkRole = require('../middleware/checkRoleMiddleware');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
router

    .get('/product-by-name',checkRole("ADMIN,SELLER,AUTHOR"), deviceController.getProductList) //rename
    .get('/getOptionForEditOrder/:id',checkRole("ADMIN,SELLER,AUTHOR"), deviceController.getOptionForEditOrder)//rename
    .get('/get-products',checkRole("ADMIN,SELLER,AUTHOR"), deviceController.getAdminProducts) //rename
    .get('/getLongProductInfo/:id',checkRole("ADMIN,SELLER,AUTHOR"), deviceController.getLongProductInfo) //rename

    .get('/getUpdateProduct/:id',checkRole("ADMIN,AUTHOR"), CreateProduct.getUpdateProductInfo) //rename
    .get('/search-similar',checkRole("ADMIN,AUTHOR"), deviceController.SearchSimilar)

    .get('/stock-history',checkRole("ADMIN"), deviceController.getStockHistory)
    .post('/', upload.array("image",50), checkRole("ADMIN,AUTHOR"), CreateProduct.create)
    .put('/:id',upload.array("image",50), checkRole("ADMIN,AUTHOR"), CreateProduct.update)

module.exports = router;