// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// firebase.initializeApp({
//     apiKey: "AIzaSyB8FBCrDSy9up5iwKdgfRm4JEU6ttpIO4M",
//     authDomain: "study-zed-notifications.firebaseapp.com",
//     projectId: "study-zed-notifications",
//     storageBucket: "study-zed-notifications.firebasestorage.app",
//     messagingSenderId: "18987464445",
//     appId: "1:18987464445:web:4e7fdd79e5085b7870b094",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log("Received background message: ", payload);

//   self.registration.showNotification(payload.notification.title, {
//     body: payload.notification.body,
//     icon: "/firebase-logo.png",
//   });
// });

importScripts(
    "https://www.gstatic.com/firebasejs/9.16.0/firebase-app-compat.js"
  );
  importScripts(
    "https://www.gstatic.com/firebasejs/9.16.0/firebase-messaging-compat.js"
  );
  
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyB8FBCrDSy9up5iwKdgfRm4JEU6ttpIO4M",
    authDomain: "study-zed-notifications.firebaseapp.com",
    projectId: "study-zed-notifications",
    storageBucket: "study-zed-notifications.firebasestorage.app",
    messagingSenderId: "18987464445",
    appId: "1:18987464445:web:4e7fdd79e5085b7870b094",
  };
  
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  
  messaging.onBackgroundMessage((payload) => {
    console.log('[Background Message]', payload);
    
    try {
      const notificationTitle = payload.notification?.title || 'New Notification';
      const notificationOptions = {
        body: payload.notification?.body || 'Click to view details',
        icon: "/firebase-logo.png",
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: Date.now().toString(),
        data: {
          timestamp: Date.now(),
          ...payload.data
        }
      };
  
      self.registration.showNotification(notificationTitle, notificationOptions);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clients) => {
        const client = clients.find((client) => client.visibilityState === 'visible');
        
        if (clients.openWindow) {
          if (client) {
            client.navigate('/notifications');
            client.focus();
          } else {
            clients.openWindow('/notifications');
          }
        }
      })
    );
  });
  