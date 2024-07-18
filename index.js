import { AppRegistry, TextInput, Text } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { theming } from 'common/constants/theming';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  return remoteMessage;
});

Text.defaultProps = Text.defaultProps || {
  fontFamily: theming.fonts.latoRegular,
};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {
  fontFamily: theming.fonts.latoRegular,
};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => App);
