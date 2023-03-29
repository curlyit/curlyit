const express = require('express');
const path = require('path');
require('dotenv').config();
const { engine } = require('express-handlebars');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const SortMiddleware = require('./app/middlewares/sortMiddleware');
const app = express();
const port = 6969;
const route = require('./routes');
const connect = require('./connectDB');

connect.connectDB();
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
); // gửi dữ liệu bằng submit form
app.use(express.json()); //đọc dữ liệu json từ request
// XMLHttpRequest, fetch, axios,... là những thư viện có thể submit data qua việc code js mà ko cần submit form
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(SortMiddleware);

//http logger
//app.use(morgan('combined'));

//template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: require('./helpers/handlebars'),
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

route(app);

app.listen(port, () =>
    console.log(`vi du nay dc thuc hien o cong http://localhost:${port}`),
);
