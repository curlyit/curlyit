const express = require('express');
const router = express.Router();
const notifier = require('node-notifier');
const productController = require('../app/controllers/ProductController');
const multer = require('multer');
const fs = require('fs');
const Product = require('../app/models/Product');
const User = require('../app/models/User');
const verifyToken = require('../app/middlewares/verifyToken');
const {
    mongooseToObject,
    multipleMongooseToObject,
} = require('../util/mongoose');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.jpg');
    },
});
var upload = multer({ storage: storage });

router.use('/:id/detail', async (req, res, next) => {
    const isUser = await User.findById(req.userId);

    Product.findById(req.params.id)
        .then((product) => {
            res.render('products/detail', {
                product: mongooseToObject(product),
                user: mongooseToObject(isUser),
            });
        })
        .catch(next);
});
router.get('/create', verifyToken, async (req, res) => {
    const isUser = await User.findById(req.userId);
    const user = mongooseToObject(isUser);

    res.render('products/create', { user: user });
});
router.get('/:id/edit', verifyToken, async (req, res, next) => {
    try {
        const isProduct = await Product.findById(req.params.id);
        const product = mongooseToObject(isProduct);

        const isUser = await User.findById(req.userId);
        const user = mongooseToObject(isUser);
        res.render('products/edit', { product: product, user: user });
    } catch (error) {}
});
router.put('/:id', upload.single('images'), verifyToken, async (req, res) => {
    try {
        const { title, price, type, describe } = req.body;

        if (req.file) {
            var imageData = fs.readFileSync(req.file.path);
            var base64Image = imageData.toString('base64');

            const image = {
                data: base64Image,
                contentType: req.file.mimetype,
                name: req.file.originalname,
            };

            var updateProduct = new Product({
                title: title,
                price: price,
                type: type,
                describe: describe,
                image: image,
                _id: req.params.id,
                user: req.userId,
            });
        } else {
            var updateProduct = new Product({
                title: title,
                price: price,
                type: type,
                describe: describe,
                _id: req.params.id,
                user: req.userId,
            });
        }

        const conditionUpdatePost = { _id: req.params.id, user: req.userId };

        updateProduct = await Product.findOneAndUpdate(
            conditionUpdatePost,
            updateProduct,
            { new: true },
        );
        notifier.notify({
            title: 'Notification!',
            message: 'Updated successfully',
            icon: 'path/to/icon.png', // đường dẫn đến icon
            sound: true, // có phát âm thanh hay không
            wait: true, // đợi người dùng nhấn vào thông báo
        });
        return res.redirect('/user/manage');
    } catch (error) {
        res.json({ success: false, message: 'Error data!' });
    }
});
router.post(
    '/store',
    verifyToken,
    upload.single('images'),
    async (req, res) => {
        var imageData = fs.readFileSync(req.file.path);
        var base64Image = imageData.toString('base64');
        // Define a JSONobject for the image attributes for saving to database

        const image = {
            data: base64Image,
            contentType: req.file.mimetype,
            name: req.file.originalname,
        };

        try {
            const { title, price, type, describe } = req.body;
            const newProduct = new Product({
                title: title,
                price: price,
                type: type,
                describe: describe,
                image: image,
                user: req.userId,
            });
            await newProduct.save();
            res.redirect('/user/manage');
        } catch (error) {
            res.json('loi du lieu');
        }
    },
);
router.delete('/:id', productController.delete);
router.delete('/:id/force', productController.deleteForce);
router.get('/trash', verifyToken, async (req, res, next) => {
    const isUser = await User.findById(req.userId);
    const user = mongooseToObject(isUser);

    await Product.findDeleted({ user: req.userId })
        .then((products) => {
            res.render('products/trash', {
                productsDeleted: multipleMongooseToObject(products),
                user: user,
            });
        })
        .catch(next);
});
router.patch('/:id/restore', productController.restore);

module.exports = router;
