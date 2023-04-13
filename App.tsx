import React, {useEffect} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import AppNavigator from './source/navigation/rootNavigator';
import SplashScreen from 'react-native-splash-screen';
import {initializeFB} from './source/api/authSocial';
import {Provider as ReduxProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from './source/store';
import {SafeAreaView} from 'react-native-safe-area-context';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    initializeFB();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar barStyle={'dark-content'} />
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
