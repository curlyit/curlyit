const express = require('express');
const router = express.Router();
const Product = require('../app/models/Product');
const User = require('../app/models/User');
const siteController = require('../app/controllers/SiteController');
const verifyToken = require('../app/middlewares/verifyToken');
const { mongooseToObject } = require('../util/mongoose');
const { multipleMongooseToObject } = require('../util/mongoose');

router.use('/', verifyToken, async (req, res, next) => {
    try {
        const isProducts = await Product.find();
        const products = multipleMongooseToObject(isProducts);

        const isUser = await User.findById(req.userId);
        const user = mongooseToObject(isUser);

        return res.render('homepage', { products: products, user: user });
    } catch (error) {}
});

module.exports = router;
