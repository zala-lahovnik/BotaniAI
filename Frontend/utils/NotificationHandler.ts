import { useContext, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { UserContext } from '../context/UserContext';
import * as Device from 'expo-device';
import { instance } from '../api/_axios_base_url';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

const NotificationHandler = () => {
  const { user, dispatch } = useContext(UserContext);
  useEffect(() => {
    registerForPushNotifications();
    Notifications.addNotificationReceivedListener(handleNotification);
  }, []);

  const registerForPushNotifications = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      let token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      sendPushTokenToServer(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

};

const sendPushTokenToServer = async (token: any) => {
    try {
      await instance.post('/user/fcm-token/' + user.userId, { fcmToken: token });
      console.log('Push token sent to server ' + token);
    } catch (error) {
      console.log('Error sending push token:', error);
    }
  };

  const handleNotification = (notification: any) => {
    console.log('Received notification:', notification);
  };
  return null;
};

export default NotificationHandler;
