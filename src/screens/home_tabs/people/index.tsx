import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';

export function PeopleScreen() {
  return (
    <View style={styles.root}>
      <Text>PeopleScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
});
