const mongoose = require("mongoose");

const DEFAULT_DB_NAME = "acmmedia";

const normalizeMongoUri = (uri) => {
    if (!uri) {
        return `mongodb+srv://ucse23032_db_user:fjcv11HF42fURQ9O@cluster0.j6asufl.mongodb.net/${DEFAULT_DB_NAME}`;
    }

    // If the cluster URI has no database path, default it so models resolve consistently.
    const hasDatabasePath = /mongodb(?:\+srv)?:\/\/[^/]+\/[^?]+/.test(uri);
    if (hasDatabasePath) {
        return uri;
    }

    const queryIndex = uri.indexOf("?");
    if (queryIndex === -1) {
        return `${uri.replace(/\/+$/, "")}/${DEFAULT_DB_NAME}`;
    }

    const base = uri.slice(0, queryIndex).replace(/\/+$/, "");
    const query = uri.slice(queryIndex);
    return `${base}/${DEFAULT_DB_NAME}${query}`;
};

const connectDB = async () => {
    const db = normalizeMongoUri(process.env.MONGO_URI);
    await mongoose.connect(db, {
        serverSelectionTimeoutMS: 10000
    });

    console.log("------------------------------");
    console.log(" MongoDB Connected Successfully");
    console.log("------------------------------");
};

module.exports = connectDB;
