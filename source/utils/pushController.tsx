import {useEffect, useState} from 'react';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {navigationRef} from '../navigation/types';
import {ChannelRepository} from '@amityco/ts-sdk';

const PushController = () => {
  const navigation = useNavigation();
  const [channelId, setChannelId] = useState('');
  const [channel, setChannel] = useState('');
  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        // console.log('TOKEN:', token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: notification => {
        // console.log('NOTIFICATION:', notification);
        // ChannelRepository.getChannel(channelId, data => {
        //   const channel = data.data;
        //   if (!data.loading) {
        //     return navigation.push('Chat', {channel});
        //   }
        //   // return data.data;
        // });

        // process the notification here
        if (channel) {
          navigation.push('Chat', {channel});
        }
        // required on iOS only
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
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
  }, []);
  useEffect(() => {
    // messaging().requestPermission();
    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      // console.log(navigation);

      setChannelId(remoteMessage.data.channelId);
      ChannelRepository.getChannel(remoteMessage.data.channelId, data => {
        // const channel = data.data;
        if (!data.loading) {
          setChannel(data.data);
        }
        // return data.data;
      });
      if (navigationRef?.current?.getCurrentRoute()?.name !== 'Chat') {
        PushNotification.localNotification({
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
        });
      }
      // console.log('mess', remoteMessage, navigationRef?.current?.getCurrentRoute()?.name);
      // PushNotification.localNotification({
      //   message: remoteMessage?.notification.body,
      //   title: remoteMessage?.notification.title,
      //   bigPictureUrl: remoteMessage?.notification.android.imageUrl,
      //   smallIcon: remoteMessage?.notification.android.imageUrl,
      // });
    });
    return unsubscribe;
  }, []);
  return null;
};
export default PushController;
