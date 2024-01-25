import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';

export function LoadingView() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size={'large'} />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
