import { Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface DCLineProps {
  containerStyle?: ViewStyle;
}

export const DCLine = ({ containerStyle }: DCLineProps) => {
  const { styles } = useStyles(styleSheet);

  return (
    <View style={[styles.line, containerStyle]}>
      <Text>index</Text>
    </View>
  );
};

const styleSheet = createStyleSheet(theming => ({
  line: {
    width: '100%',
    height: 1,
    backgroundColor: theming.colors.gray50,
  },
}));
