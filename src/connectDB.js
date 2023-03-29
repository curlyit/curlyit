const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cql3u.mongodb.net/?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
        console.log('connected DB');
    } catch (error) {
        console.log('error');
        process.exit(1);
    }
};

module.exports = { connectDB };
