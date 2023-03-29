const express = require('express');
const router = express.Router();
const User = require('../app/models/User');
const Product = require('../app/models/Product');
const jwt = require('jsonwebtoken');
const {
    mongooseToObject,
    multipleMongooseToObject,
} = require('../util/mongoose');
const verifyToken = require('../app/middlewares/verifyToken');

const userController = require('../app/controllers/UserController');

router.get('/register', userController.register);
router.get('/login', userController.login);
router.get('/manage', verifyToken, async (req, res, next) => {
    try {
        const isProductsUser = await Product.find({ user: req.userId });
        const productsUser = multipleMongooseToObject(isProductsUser);

        const isUser = await User.findById(req.userId);
        const user = mongooseToObject(isUser);

        const deletedCount = await Product.countDocumentsDeleted({
            user: req.userId,
        });
        res.render('users/manage', {
            productsUser: productsUser,
            user: user,
            deletedCount: deletedCount,
        });
    } catch (error) {}
});
router.post('/checkLogin', userController.checkLogin);
router.post('/checkRegister', userController.checkRegister);
router.get('/logout', userController.logout);

module.exports = router;
