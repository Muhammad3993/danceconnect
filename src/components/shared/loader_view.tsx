import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';

export function LoaderView() {
  return (
    <View style={styles.root}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
