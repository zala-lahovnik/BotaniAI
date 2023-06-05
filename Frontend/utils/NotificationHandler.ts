import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { instance } from '../api/_axios_base_url';

export const registerForPushNotifications = async (userId: string) => {
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
      sendPushTokenToServer(token, userId);
    } else {
      alert('Must use physical device for Push Notifications');
    }
};

const sendPushTokenToServer = async (token: any, userId: string) => {
    try {
      await instance.post('/user/fcm-token/' + userId, { fcmToken: token });
      console.log('Push token sent to server ' + token);
    } catch (error) {
      console.log('Error sending push token:', error);
    }
};
