import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import AppNavigator from './source/navigation/rootNavigator';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'default'} />
      <AppNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
