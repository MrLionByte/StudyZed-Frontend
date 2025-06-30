importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB8FBCrDSy9up5iwKdgfRm4JEU6ttpIO4M",
  authDomain: "study-zed-notifications.firebaseapp.com",
  projectId: "study-zed-notifications",
  storageBucket: "study-zed-notifications.appspot.com",
  messagingSenderId: "18987464445",
  appId: "1:18987464445:web:4e7fdd79e5085b7870b094",
  measurementId: "G-F092M16WY7"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
