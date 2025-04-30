const { Disconnect } = require('../helpers/socket/Disconnect');
const { Register } = require('../helpers/socket/Register');
const { TaskUpdate } = require('../helpers/socket/TaskUpdate');
const { IO_EVENTS, SOCKET_EVENTS } = require('./constants');

const users = new Map();

module.exports = async (io) => {
    try {

        io.on(IO_EVENTS.CONNECTION, (socket) => {

            // Listen for user joining
            socket.on(SOCKET_EVENTS.REGISTER, (userId) => {
                Register(socket, users, userId);
            });

            // Listen for task updates
            socket.on(SOCKET_EVENTS.TASK_UPDATE, ({ to, updateTask, fcmToken }) => {
                TaskUpdate(socket, to, updateTask, fcmToken);
            });

            // Cleanup on disconnect
            socket.on(SOCKET_EVENTS.DISCONNECT, () => {
                Disconnect(socket, users);
            });
        });
    } catch (error) {
        console.log(error);
    }
};
