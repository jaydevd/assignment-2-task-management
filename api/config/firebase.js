const admin = require('firebase-admin');

try {
    admin.initializeApp({
        credential: admin.credential.cert(require('./../../service-account.json'))
    });

} catch (error) {
    throw new Error(error);
}

module.exports.firebaseApp = admin;