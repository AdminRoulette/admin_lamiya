const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require("../middleware/checkRoleMiddleware");

router

    .post('/logingoogle', userController.loginGoogle)
    .get('/auth',  userController.check)

    .get('/user-stats', checkRole("ADMIN,SELLER"),  userController.getUserStats)
    .get('/all-users-stats', checkRole("ADMIN,SELLER"),  userController.getAllUsersStats)
    .put('/user-stats', checkRole("ADMIN,SELLER"),  userController.changeUserStatsComment)

    .get('/all', checkRole("ADMIN"),  userController.allUsers)
    .put('/user', checkRole("ADMIN"),  userController.changeUser)
    .post('/create-user', checkRole("ADMIN"),  userController.createUser)
    .get('/cashiers', checkRole("ADMIN"),  userController.allCashiers)
    .post('/cashiers', checkRole("ADMIN"),  userController.createCashiers)
    .put('/cashiers', checkRole("ADMIN"),  userController.changeCashier)
    .delete('/cashiers', checkRole("ADMIN"),  userController.deleteCashier)
module.exports = router;