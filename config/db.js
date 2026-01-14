const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://ucse23032_db_user:fjcv11HF42fURQ9O@cluster0.j6asufl.mongodb.net/acmmedia");
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error");
        process.exit(1);
    }
};

module.exports = connectDB;
