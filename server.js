require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

connectDB();
const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "https://acm-xim-envoy.vercel.app"],
    credentials: true
}));

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

const PORT = process.env.PORT || 5000; // Render will inject this automatically
app.listen(PORT, '0.0.0.0', () => console.log(`Server active on port ${PORT}`));
