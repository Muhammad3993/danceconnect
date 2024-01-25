/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './source/i18n/i118n';

LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);
