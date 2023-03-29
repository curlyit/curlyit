const siteRouter = require('./site');
const userRouter = require('./user');
const productRouter = require('./product');

function route(app) {
    app.use('/user', userRouter);
    app.use('/product', productRouter);
    app.use('/', siteRouter);
}

module.exports = route;
