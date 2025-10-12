const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const ratingController = require('../controllers/ratingController')
const checkRole = require("../middleware/checkRoleMiddleware");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/',limits:{fieldSize: 10000000}  })

router
    .get('/get-all',  checkRole("ADMIN"), ratingController.getAll)
    .post('/moderation-rating',  checkRole("ADMIN"), ratingController.moderationRating)
    .post('/moderation-reply',  checkRole("ADMIN"), ratingController.moderationReply)
    .post('/edit-rating',  checkRole("ADMIN"), ratingController.EditRating)
    .delete('/delete-reply/:id',  checkRole("ADMIN"), ratingController.deleteReply)
    .delete('/delete-rating/:id',  checkRole("ADMIN"), ratingController.deleteRating)


module.exports = router;
