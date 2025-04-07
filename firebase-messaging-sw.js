import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase first
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const vapidKey = import.meta.env.VITE_VAPID_KEY;

// Register service worker AFTER initializing Firebase
// Only register if it's a browser environment
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
            console.log("Service Worker registered:", registration);
        })
        .catch((err) => {
            console.error("Service Worker registration failed:", err);
        });
}

export { messaging, getToken, onMessage, vapidKey };