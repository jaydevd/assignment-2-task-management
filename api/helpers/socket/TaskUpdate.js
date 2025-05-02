const { SOCKET_EVENTS } = require("../../config/constants");
const { SendNotification } = require("../firebase/SendNotification");
const { SaveTask } = require("./SaveTask");

module.exports.TaskUpdate = async (socket, users, to, updateTask, fcmToken) => {
    const targetSocketId = users.get(to);

    SaveTask(updateTask);
    SendNotification(fcmToken);

    if (targetSocketId) {
        io.to(targetSocketId).emit(SOCKET_EVENTS.TASK_UPDATE, {
            from: socket.id,
            updateTask,
        });
    }
}