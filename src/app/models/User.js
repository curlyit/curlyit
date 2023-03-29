const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            require: true,
        },
        username: {
            type: String,
            require: true,
            unique: true,
        },
        phone: {
            type: String,
            require: true,
        },
        password: {
            type: String,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
