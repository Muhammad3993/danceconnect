import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Navigation } from './screens';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { theming } from 'common/constants/theming';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toasts } from '@backpackapp-io/react-native-toast';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <BottomSheetModalProvider>
            <SafeAreaView style={styles.root}>
              <StatusBar barStyle="dark-content" />
              <I18nextProvider i18n={i18n} defaultNS={'translation'}>
                <Navigation />
              </I18nextProvider>
            </SafeAreaView>
          </BottomSheetModalProvider>
          <Toasts />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
});

export default App;
