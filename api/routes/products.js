
const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require("../middleware/chack-auth");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const {
    products_get_all,
    products_create_product,
    products_get_product,
    products_update_product,
    products_delete
} = require("../controllers/products")



router.get('/', products_get_all);
router.post('/', checkAuth, upload.single('productImage'), products_create_product);
router.get('/:productId', products_get_product);
router.patch('/:productId', checkAuth, products_update_product);
router.delete('/:productId', checkAuth, products_delete);


module.exports = router;
