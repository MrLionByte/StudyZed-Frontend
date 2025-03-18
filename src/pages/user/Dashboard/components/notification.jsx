import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { Button, Drawer, message, Empty, List, Badge, Spin } from 'antd';
import { Bell, RefreshCcw, CheckIcon } from 'lucide-react';
import {
  getToken,
  messaging,
  onMessage,
} from '../../../../utils/firebase_messaging';
import { getSavedAuthData } from '../../../../utils/Localstorage';
import axios from 'axios';
import { API_BASE_URLS } from '../../../../api/axios_api_call';
import { vapidKey } from '../../../../utils/firebase_messaging';
import { RadiusUpleftOutlined } from '@ant-design/icons';

const AppNotification = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const user = getSavedAuthData();

  const requestNotificationPermission = async (user_code) => {
    try {
      setLoading(true);
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: vapidKey,
        });

        if (token) {
          await axios.post(
            `${API_BASE_URLS['Notification_Service']}notification/save-fcm-token/`,
            {
              user_code: user_code,
              token,
            },
          );
        }
      } else {
        console.log('Permission denied for notifications');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const url = API_BASE_URLS['Notification_Service'];
      await axios.post(`${url}notification/mark-as-read/`, {
        notification_id: notificationId,
        user_code: user.user_code,
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      message.error('Failed to mark notification as read');
      setError(error.message);
    }
  };

  const refreshNotifications = async () => {
    try {
      setLoading(true);
      const url = API_BASE_URLS['Notification_Service'];
      const response = await axios.get(
        `${url}notification/list/${user.user_code}/`,
      );
      console.log('Rfresh :', response);

      setNotifications(response.data);
      setUnreadCount(response.data.filter((notif) => !notif.read).length);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshNotifications,
    requestNotificationPermission,
  }));

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Rfresh xx :', payload);
      const newNotification = {
        id: Date.now(),
        title: payload.notification?.title || 'New Notification',
        body: payload.notification?.body || 'Click to view details',
        timestamp: new Date().toISOString(),
        due_date: payload?.data?.due_time || '',
        type: payload.data?.type || '',
        read: false,
        data: payload.data,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      if (newNotification?.type == 'alert') {
        message.warning(newNotification.body);
      }
      console.log('Rfresh xx :', newNotification);
      if (document.hidden) {
        message.info({
          content: payload.notification?.title,
          duration: 3,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Badge count={unreadCount} offset={[-5, 5]}>
        <Button
          className="p-2 hover:bg-transparent bg-transparent border-0 rounded-full relative"
          onClick={() => setOpen(true)}
        >
          <Bell className="text-teal-400 cursor-pointer" />
        </Button>
      </Badge>
      <Drawer
        title="Notifications"
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        extra={
          <Button
            className="text-center border-0"
            onClick={refreshNotifications}
            icon={<RefreshCcw className="hover:size-7" />}
          />
        }
      >
        <Spin spinning={loading}>
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md mb-4">
              {/* {error} */}
            </div>
          )}
          {notifications.length === 0 ? (
            <Empty description="No notifications yet" />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(notif) => (
                <List.Item
                  className="hover:bg-gray-50 p-4 rounded-lg transition"
                  extra={
                    <div className="flex items-center gap-2">
                      {notif.type === 'alert' && (
                        <RadiusUpleftOutlined
                          style={{ fontSize: '18px', color: 'red' }}
                        />
                      )}

                      {!notif.read && (
                        <Button
                          className="p-1 rounded-lg bg-gray-300 hover:bg-emerald-500 transition"
                          onClick={() => handleMarkAsRead(notif.id)}
                        >
                          <CheckIcon className="w-4 h-4 text-gray-700 hover:text-white hover:bg-emerald-500" />
                        </Button>
                      )}
                    </div>
                  }
                >
                  <List.Item.Meta
                    title={notif.message || notif.title}
                    description={
                      <div>
                        <p className="text-gray-600">{notif.body}</p>
                        <p className="text-xs text-gray-400">
                          {(notif.due_date || notif.created_at) &&
                          !isNaN(
                            new Date(
                              notif.due_date || notif.created_at,
                            ).getTime(),
                          )
                            ? new Date(
                                notif.due_date || notif.created_at,
                              ).toLocaleString()
                            : ''}
                        </p>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Drawer>
    </>
  );
});

export default AppNotification;
