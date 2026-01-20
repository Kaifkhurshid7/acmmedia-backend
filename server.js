require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

connectDB();
const app = express();

// Request logger for debugging Render/Routing issues
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Robust CORS configuration
// app.use(cors({
//     origin: ["http://localhost:5173", "https://acmmedia-frontend.vercel.app", "https://acmmedia-frontend.vercel.app"],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true
// }));
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    console.log("Server: Health Ok")
    return res.send("Server: Health OK")
})

app.get("/api", (req, res) => {
    console.log("API: Health Ok")
    return res.send("API: Health OK")
})

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/forum", require("./routes/forum"));
app.use("/api/events", require("./routes/events"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/external-news", require("./routes/news"));
app.use("/api/upload", require("./routes/upload"));

// Catch-all 404 handler for debugging missing routes
app.use((req, res) => {
    console.log(`404 Hit: ${req.method} ${req.url}`);
    res.status(404).json({
        error: "Route not found",
        method: req.method,
        path: req.url,
        tip: "Check if the route is registered in server.js and the path matches exactly."
    });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server active on port ${PORT}`));

// Initialize Socket.IO
const io = require("./socket").init(server);
