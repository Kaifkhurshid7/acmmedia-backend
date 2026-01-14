const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const db = process.env.MONGO_URI || "mongodb+srv://ucse23032_db_user:fjcv11HF42fURQ9O@cluster0.j6asufl.mongodb.net/acmmedia";
        await mongoose.connect(db);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        // process.exit(1); // Removed to allow server to stay up for debugging health checks
    }
};

module.exports = connectDB;
