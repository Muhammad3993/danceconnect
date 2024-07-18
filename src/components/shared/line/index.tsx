import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';

export const DCLine = () => {
  return (
    <View style={styles.line}>
      <Text>index</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 1,
    backgroundColor: theming.colors.gray50,
  },
});
