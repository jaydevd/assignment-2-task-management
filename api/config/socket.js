const users = new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {

        // Listen for user joining
        socket.on('register', (userId) => {
            users.set(userId, socket.id);
            console.log(users);
            console.log(`User ${userId} registered with socket ID ${socket.id}`);
        });

        // Listen for private messages
        socket.on('private_message', ({ to, message }) => {
            console.log("message received", to, message);
            const targetSocketId = users.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('private_message', {
                    from: socket.id,
                    message,
                });
            }
        });

        // Cleanup on disconnect
        socket.on('disconnect', () => {
            for (const [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                    users.delete(userId);
                    break;
                }
            }
            console.log('User disconnected:', socket.id);
        });
    });
};
