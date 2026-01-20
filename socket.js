let io;

module.exports = {
    init: (httpServer) => {
        io = require("socket.io")(httpServer, {
            cors: {
                origin: "*", // For development, allow all. Adjust in production.
                methods: ["GET", "POST", "PUT", "DELETE"],
            },
        });
        console.log("Socket.IO initialized");

        io.on("connection", (socket) => {
            console.log(`New client connected: ${socket.id}`);

            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });

        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    },
};
