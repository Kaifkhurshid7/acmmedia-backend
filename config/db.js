const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const db = process.env.MONGO_URI || "mongodb+srv://ucse23032_db_user:fjcv11HF42fURQ9O@cluster0.j6asufl.mongodb.net/acmmedia";
        await mongoose.connect(db);
        console.log("------------------------------");
        console.log(" MongoDB Connected Successfully");
        console.log("------------------------------");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
    }
};

module.exports = connectDB;
