module.exports.Register = (socket, users, userId) => {

    users.set(userId, socket.id);
    console.log(users);
    console.log(`User ${userId} registered with socket ID ${socket.id}`);

    return users;
}
