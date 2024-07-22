import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';

interface DCLineProps {
  containerStyle?: ViewStyle;
}

export const DCLine = ({containerStyle}: DCLineProps) => {
  return (
    <View style={[styles.line, containerStyle]}>
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
