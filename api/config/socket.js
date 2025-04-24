const admin = require('firebase-admin');
const users = new Map();

module.exports = async (io) => {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(require('./../../service-account.json'))
        });
        io.on('connection', (socket) => {

            // Listen for user joining
            socket.on('register', (userId) => {
                users.set(userId, socket.id);
                console.log(users);
                console.log(`User ${userId} registered with socket ID ${socket.id}`);
            });

            socket.on('update_task', ({ to, updateTask, fcmToken }) => {
                const targetSocketId = users.get(to);
                const payload = {
                    notification: {
                        title: 'Task Management System',
                        body: "Task Updated",
                    },
                    token: fcmToken,
                };
                const sendMessage = async () => {
                    await admin.messaging().send(payload);
                }
                sendMessage();

                if (targetSocketId) {
                    io.to(targetSocketId).emit('update_task', {
                        from: socket.id,
                        updateTask,
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
    } catch (error) {
        console.log(error);
    }
};
