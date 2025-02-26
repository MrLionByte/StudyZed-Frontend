
// const firebaseConfig = {
//     apiKey: "AIzaSyB8FBCrDSy9up5iwKdgfRm4JEU6ttpIO4M",
//     authDomain: "study-zed-notifications.firebaseapp.com",
//     projectId: "study-zed-notifications",
//     storageBucket: "study-zed-notifications.firebasestorage.app",
//     messagingSenderId: "18987464445",
//     appId: "1:18987464445:web:4e7fdd79e5085b7870b094",
//     measurementId: "G-F092M16WY7"
//   };

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import {initializeApp} from 'firebase/app';
import {getMessaging, getToken, onMessage} from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyB8FBCrDSy9up5iwKdgfRm4JEU6ttpIO4M",
    authDomain: "study-zed-notifications.firebaseapp.com",
    projectId: "study-zed-notifications",
    storageBucket: "study-zed-notifications.firebasestorage.app",
    messagingSenderId: "18987464445",
    appId: "1:18987464445:web:4e7fdd79e5085b7870b094",
    measurementId: "G-F092M16WY7"
  };

navigator.serviceWorker
  .register("/firebase-messaging-sw.js")
  .then((registration) => {
    console.log("Service Worker registered:", registration);
  })
  .catch((err) => {
    console.error("Service Worker registration failed:", err);
  });

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const vapidKey = "BLu8ur7rWFdv1DCqieJMJmx2KBVL_iqBAtBWNc1MbhoYFJ3cMrXYgbsZADcVFOzGqecT8_EQjatZBOriPOOHhfI"
export { messaging, getToken, onMessage,vapidKey };