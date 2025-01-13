import 'common/theming/unistyles';

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Navigation } from './screens';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const { styles } = useStyles(styleSheet);
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <BottomSheetModalProvider>
            <StatusBar barStyle="dark-content" />
            <I18nextProvider i18n={i18n} defaultNS={'translation'}>
              <Navigation />
            </I18nextProvider>
          </BottomSheetModalProvider>
          <Toasts />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styleSheet = createStyleSheet(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
}));

export default App;
