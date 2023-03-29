const Course = require('../models/Course');
const Product = require('../models/Product');
const { multipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    home(req, res, next) {
        Product.find({})
            .then((products) => {
                const isProducts = multipleMongooseToObject(products);
                res.render('homepage', {
                    products: isProducts,
                });
            })
            .catch(next);
    }
}
module.exports = new SiteController();
