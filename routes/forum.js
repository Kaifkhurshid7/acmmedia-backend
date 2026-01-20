const router = require("express").Router();
const Forum = require("../models/Forum");
const auth = require("../middleware/auth");

// Get all forum threads
router.get("/", async (req, res) => {
    try {
        const threads = await Forum.find().sort({ createdAt: -1 });
        res.json(threads);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Create a thread
router.post("/", auth, async (req, res) => {
    try {
        const newThread = new Forum({
            ...req.body,
            author: req.user.id
        });
        const thread = await newThread.save();
        res.json(thread);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Reply to a thread
router.post("/reply/:id", auth, async (req, res) => {
    try {
        const thread = await Forum.findById(req.params.id);
        if (!thread) return res.status(404).json({ msg: "Thread not found" });

        const newReply = {
            user: req.user.id,
            text: req.body.text
        };
        thread.replies.push(newReply);
        await thread.save();

        getIO().emit("forum:new-reply", {
            threadId: thread._id,
            reply: newReply
        });

        res.json(thread);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Delete a thread (Admin only)
router.delete("/:id", auth, async (req, res) => {
    try {
        const thread = await Forum.findById(req.params.id);
        if (!thread) return res.status(404).json({ msg: "Thread not found" });

        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Access denied" });
        }

        await thread.deleteOne();

        emitAnalytics();

        res.json({ msg: "Thread removed" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

const { getIO, emitAnalytics } = require("../socket");

module.exports = router;
