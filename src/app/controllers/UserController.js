const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
    // route: /user/register
    register(req, res, next) {
        res.render('users/register');
    }

    // route: /user/login
    login(req, res, next) {
        res.render('users/login');
    }

    // route: /user/checkLogin
    checkLogin(req, res, next) {
        const { username, password } = req.body;

        User.findOne({ username })
            .then((user) => {
                if (!user) {
                    res.json({
                        success: false,
                        errorMessage: 'Username không tồn tại!',
                    });
                } else if (password !== user.password) {
                    res.json({
                        success: false,
                        errorMessage: 'Mật khẩu không đúng!',
                    });
                } else {
                    const accessToken = jwt.sign(
                        { userId: user.id },
                        process.env.ACCESS_TOKEN_SECRET,
                    );
                    res.cookie('access_token', accessToken, {
                        //maxAge: 900000,
                        httpOnly: true,
                    });
                    res.json({
                        success: true,
                        errorMessage: 'Đăng nhập thành công! ',
                        accessToken,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({
                    success: false,
                    errorMessage: 'Lỗi server',
                });
            });
    }

    // route: /user/register
    async checkRegister(req, res, next) {
        const { fullName, username, phone, password, rePassword } = req.body;
        const regexFullName = /^[a-zA-Z\s]+$/;
        const regexPhone = /^0\d{9}$/;
        var isUser = false;

        if (!regexFullName.test(fullName)) {
            return res.json({
                success: false,
                message: "Trường 'Full Name' không hợp lệ!",
            });
        }
        if (!regexPhone.test(phone)) {
            return res.json({
                success: false,
                message: 'Số điện thoại không hợp lệ!',
            });
        }
        if (password.length < 4) {
            return res.json({
                success: false,
                message: 'Mật khẩu quá ngắn, vui lòng nhập lại!',
            });
        }
        if (rePassword !== password) {
            return res.json({
                success: false,
                message: "Vui lòng nhập lại trường 'Repeat Password'!",
            });
        }

        try {
            const user = await User.findOne({ username });
            if (user) {
                return res.json({
                    success: false,
                    message: 'Tên tài khoản đã tồn tại!',
                });
            }

            const newUser = new User({
                fullName,
                username,
                phone,
                password,
                rePassword,
            });
            await newUser.save();

            const accessToken = jwt.sign(
                { userId: newUser.id },
                process.env.ACCESS_TOKEN_SECRET,
            );

            res.cookie('access_token', accessToken, {
                //maxAge: 900000,
                httpOnly: true,
            });

            res.json({
                success: true,
                message: 'Đăng kí thành công!',
                accessToken,
            });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: 'loi' });
        }
    }

    // route: /user/logout
    logout(req, res, next) {
        res.clearCookie('access_token');
        res.redirect('/');
    }
}

module.exports = new UserController();
