// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBtTZxVIg3DoLTF1eqWpzeLNhYun8dQrG8",
    authDomain: "push-notification-1874a.firebaseapp.com",
    projectId: "push-notification-1874a",
    storageBucket: "push-notification-1874a.firebasestorage.app",
    messagingSenderId: "914824646317",
    appId: "1:914824646317:web:2d9b7323e5de919a2e8024"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

module.exports = firebaseApp;