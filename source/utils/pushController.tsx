import {useEffect, useState} from 'react';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {navigationRef} from '../navigation/types';

const PushController = () => {
  const navigation = useNavigation();
  const [channel, setChannel] = useState<any>();
  useEffect(() => {
    PushNotification.configure({
      onRegister: function (token) {
        // console.log('TOKEN:', token);
      },

      onNotification: notification => {
        console.log('NOTIFICATION:', notification, channel);

        // process the notification here
        if (channel) {
          navigation.push('Chat', {channel: channel});
        }
      },
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, [channel, navigation]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      // console.log(remoteMessage);

      setChannel({
        defaultSubChannelId: remoteMessage.data.channelId,
      });

      if (navigationRef?.current?.getCurrentRoute()?.name !== 'Chat') {
        PushNotification.localNotification({
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
        });
      }
      return;
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    const backSubscribe = messaging().onNotificationOpenedApp(
      (message: any) => {
        // console.log('getInitialNotification', message);
        // setChannel({
        //   defaultSubChannelId: message.data.channelId,
        // });
        if (message.data.channelId) {
          const data = {
            defaultSubChannelId: message.data.channelId,
          };
          navigation.push('Chat', {
            channel: data,
          });
        }
        return;
      },
    );
    return backSubscribe;
  }, [navigation]);
  return null;
};
export default PushController;
