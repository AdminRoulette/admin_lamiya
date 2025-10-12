const Router = require('express');
const router = new Router();
const blogController = require('../controllers/blogController');
const checkRole = require('../middleware/checkRoleMiddleware');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router
    .post('/create-article', upload.array("image",1), checkRole("ADMIN,AUTHOR"), blogController.CreateArticle)
    .get('/get-list', checkRole("ADMIN,AUTHOR"), blogController.getArticlesList)
    .get('/get-products', checkRole("ADMIN,AUTHOR"), blogController.getProduct)
    .post('/edit-article', upload.array("image",1), checkRole("ADMIN,AUTHOR"), blogController.EditArticle)
    .get('/get-article', checkRole("ADMIN,AUTHOR"), blogController.getArticle)
    .get('/get-products-info', checkRole("ADMIN,AUTHOR"), blogController.getProductsInfo)
    .get('/get-blog-categories', checkRole("ADMIN,AUTHOR"), blogController.getBlogCategories)
    .get('/get-blog-authors', checkRole("ADMIN,AUTHOR"), blogController.getBlogAuthor)
    .post('/create-authors',upload.array("image",1), checkRole("ADMIN,AUTHOR"), blogController.createAuthor)
    .post('/edit-authors',upload.array("image",1), checkRole("ADMIN,AUTHOR"), blogController.editAuthors)
    .post('/create-category', checkRole("ADMIN,AUTHOR"), blogController.createCategory)
    .post('/edit-category', checkRole("ADMIN,AUTHOR"), blogController.editCategory)
    .post('/upload-image',upload.array("image",4), checkRole("ADMIN,AUTHOR"), blogController.uploadImage)

module.exports = router;