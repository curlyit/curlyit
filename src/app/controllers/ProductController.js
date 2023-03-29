const Product = require('../models/Product');
const {
    mongooseToObject,
    multipleMongooseToObject,
} = require('../../util/mongoose');

class ProductController {
    // Method: DElETE SOFT
    // Route: /product/:_id
    delete(req, res, next) {
        Product.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // Method: DELETE FORCE
    // Route: /product/:_id/force
    deleteForce(req, res, next) {
        Product.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // Method: PATCH
    // Route: /product/:_id/restore
    restore(req, res, next) {
        Product.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
}
module.exports = new ProductController();
