const admin = require('firebase-admin');
const users = new Map();

admin.initializeApp({
    credential: admin.credential.cert(require('./../../service-account.json'))
});

module.exports = async (io) => {
    io.on('connection', (socket) => {

        // Listen for user joining
        socket.on('register', (userId) => {
            users.set(userId, socket.id);
            console.log(users);
            console.log(`User ${userId} registered with socket ID ${socket.id}`);
        });

        // Listen for comments
        socket.on('comment', ({ to, comment }) => {
            console.log("comment received", to, comment);
            const payload = {
                notification: {
                    title: 'Task Management System',
                    body: { comment, from, to },
                },
                token: fcmToken,
            };

            const response = await admin.messaging().send(payload);
            const targetSocketId = users.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('comment', {
                    from: socket.id,
                    comment,
                });
            }
        });

        socket.on('update_task', ({ to, task }) => {
            const targetSocketId = users.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('update_task', {
                    from: socket.id,
                    task,
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
