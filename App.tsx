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

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    initializeFB();
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId:
        '510785169210-nuvgcms1kiglc2vqe2stgpub06le22q7.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);
  LogBox.ignoreAllLogs();
  const statusBarContent = isAndroid ? 'light-content' : 'dark-content';
  return (
    <SafeAreaView style={styles.container}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar barStyle={statusBarContent} />
          <FullLoading />
          <AppNavigator />
        </PersistGate>
      </ReduxProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
