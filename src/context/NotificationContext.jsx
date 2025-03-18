import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getSavedAuthData } from '../utils/Localstorage';
import { API_BASE_URLS } from '../api/axios_api_call';
import { messaging, onMessage } from '../utils/firebase_messaging';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const user = getSavedAuthData();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URLS['Notification_Service']}notification/list/${user.user_code}/`,
      );
      console.log('Notify Context :', response);

      setNotifications(response.data);
      setUnreadAlerts(
        response.data.filter((notif) => notif.type === 'alert' && !notif.read)
          .length,
      );
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('New notification received:', payload);
      fetchNotifications();
    });
    return () => unsubscribe();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadAlerts }}>
      {children}
    </NotificationContext.Provider>
  );
};
