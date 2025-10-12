const Router = require('express');
const router = new Router();
const RozetkaController = require('../controllers/rozetkaController');
const checkRole = require("../middleware/checkRoleMiddleware");
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage-files/');
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname.toLowerCase());
    },
});
const upload = multer({ storage: storage, fileSize: 150 * 1024 * 1024 });

router

    .get('/marketplace', checkRole("ADMIN"), RozetkaController.Marketplace)
    .post('/create-elastic', checkRole("ADMIN"), RozetkaController.CreateElastic)
    .get('/storage-excel', checkRole("ADMIN"), RozetkaController.StorageExcel)
    .put('/update-elastic', checkRole("ADMIN"), RozetkaController.UpdateElastic)
    .delete('/delete-product', checkRole("ADMIN"), RozetkaController.DeleteProduct)
    .delete('/delete-option', checkRole("ADMIN"), RozetkaController.DeleteOption)
    .post('/update-score', checkRole("ADMIN"), RozetkaController.UpdateProductScore)
    .post('/upload-xml', upload.single('file'), checkRole("ADMIN"), RozetkaController.UploadXML)

    .post('/test1', checkRole("ADMIN"), RozetkaController.Test1)
    .post('/test2', checkRole("ADMIN"), RozetkaController.Test2)
    .post('/test3', checkRole("ADMIN"), RozetkaController.Test3)
    .post('/test4', checkRole("ADMIN"), RozetkaController.Test4)
    .post('/test5', checkRole("ADMIN"), RozetkaController.Test5)

module.exports = router;
