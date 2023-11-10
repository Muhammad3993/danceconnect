import React, {useEffect} from 'react';
import {LogBox, StatusBar, StyleSheet} from 'react-native';
import AppNavigator from './source/navigation/rootNavigator';
import SplashScreen from 'react-native-splash-screen';
import {initializeFB} from './source/api/authSocial';
import {Provider as ReduxProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from './source/store';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {SafeAreaView} from 'react-native-safe-area-context';
import {isAndroid} from './source/utils/constants';
import FullLoading from './source/components/fullLoading';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Notice} from './source/components/errorNotice';
import {Linking} from 'react-native';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    initializeFB();
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId:
        '510785169210-lf70g9qu4i2htf64g20emmqs2elosoal.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);
  LogBox.ignoreAllLogs();
  const statusBarContent = isAndroid ? 'light-content' : 'dark-content';
  useEffect(() => {
    // handles deep link when app is already open
    Linking.addEventListener('url', evt => {
      console.log(evt.url);
    });

    // handles deep link when app is not already open
    Linking.getInitialURL()
      .then(url => console.log('Initial URL:', url))
      .catch(console.warn);

    return () => {
      // clears listener when component unmounts
      Linking.removeAllListeners('url');
    };
  }, []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StatusBar barStyle={statusBarContent} />
            <Notice />
            <FullLoading />
            <AppNavigator />
          </PersistGate>
        </ReduxProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
