    const Router = require('express');
const router = new Router();
const filtersController = require('../controllers/Product/filtersController');
const checkRole = require('../middleware/checkRoleMiddleware');

router
    .get('/category-filters',checkRole("ADMIN,FILTER"), filtersController.getCategoryFilters)
    .post('/delete-category-filters',checkRole("ADMIN,AUTHOR"), filtersController.deleteCategoryFilters)
    .post('/add-category-filters',checkRole("ADMIN,AUTHOR"), filtersController.addCategoryFilters)

    .post('/note/add-all',checkRole("ADMIN,SELLER"), filtersController.AddAllNotes)

    .get('/all-countries',checkRole("ADMIN,AUTHOR"), filtersController.getAllCountries)

    .get('/get-all',checkRole("ADMIN,AUTHOR,FILTER"), filtersController.getFilters)

    .post('/create',checkRole("ADMIN"), filtersController.createFilter)
    .put('/edit',checkRole("ADMIN"), filtersController.editFilter)
    .post('/create-value',checkRole("ADMIN,FILTER"), filtersController.createFilterValue)
    .put('/edit-value',checkRole("ADMIN,FILTER"), filtersController.editFilterValue)
    .post('/delete-value',checkRole("ADMIN,FILTER"), filtersController.deleteFilterValue)
module.exports = router;
