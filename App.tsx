import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {StatusBar, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Provider as ReduxProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Notice} from './source/components/errorNotice';
import FullLoading from './source/components/fullLoading';
import i18n from './source/i18n/i118n';
import AppNavigator from './source/navigation/rootNavigator';
import store, {persistor} from './source/store';
import {isAndroid} from './source/utils/constants';

const App = () => {
  const statusBarContent = isAndroid ? 'light-content' : 'dark-content';
  // useEffect(() => {
  //   // handles deep link when app is already open
  //   Linking.addEventListener('url', evt => {
  //     console.log(evt.url);
  //   });

  //   // handles deep link when app is not already open
  //   Linking.getInitialURL()
  //     .then(url => console.log('Initial URL:', url))
  //     .catch(console.warn);

  //   return () => {
  //     // clears listener when component unmounts
  //     Linking.removeAllListeners('url');
  //   };
  // }, []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ReduxProvider store={store}>
          <I18nextProvider i18n={i18n} defaultNS={'translation'}>
            <PersistGate loading={null} persistor={persistor}>
              <StatusBar barStyle={statusBarContent} />
              <AppNavigator />
              <Notice />
              <FullLoading />
            </PersistGate>
          </I18nextProvider>
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
