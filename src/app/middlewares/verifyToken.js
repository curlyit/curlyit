const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const { multipleMongooseToObject } = require('../../util/mongoose');

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        if (req.url === '/') {
            return Product.find({})
                .then((products) => {
                    const isProducts = multipleMongooseToObject(products);
                    res.render('homepage', {
                        products: isProducts,
                    });
                })
                .catch(next);
        } else {
            return res
                .status(401)
                .json({ success: false, message: 'Access token not found' });
        }
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ success: false, message: 'Invalid token' });
    }
};

module.exports = verifyToken;
