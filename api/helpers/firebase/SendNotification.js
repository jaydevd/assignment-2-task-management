const { NOTIFICATION } = require("../../config/constants");
const { firebaseApp } = require("../../config/firebase")

module.exports.SendNotification = async (fcmToken) => {
    const payload = {
        notification: {
            title: NOTIFICATION.TITLE,
            body: NOTIFICATION.BODY,
        },
        token: fcmToken,
    };
    await firebaseApp.messaging().send(payload);
}