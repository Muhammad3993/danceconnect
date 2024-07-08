import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';

export function CommunitiesScreen() {
  return (
    <View style={styles.root}>
      <Text>CommunitiesScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
});
