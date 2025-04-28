module.exports.Disconnect = (socket, users) => {
    for (const [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
            users.delete(userId);
            break;
        }
    }
    console.log('User disconnected:', socket.id);
}