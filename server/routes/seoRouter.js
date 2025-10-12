const Router = require('express');
const router = new Router();
const seoController = require('../controllers/seoController')
const checkRole = require("../middleware/checkRoleMiddleware");


router

    .post('/edit', checkRole("SEO,ADMIN"), seoController.seoEdit)
    .post('/create', checkRole("SEO,ADMIN"), seoController.seoCreate)
    .get('/list', checkRole("SEO,ADMIN"), seoController.getSeoList)
    .get('/import', checkRole("SEO,ADMIN"), seoController.importSeoFromGoogle)
    .post('/',checkRole("SEO,ADMIN,AUTHOR"), seoController.getSeo)

module.exports = router;
