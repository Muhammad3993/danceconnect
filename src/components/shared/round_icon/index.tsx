import { StyleSheet, View, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface DCIconProps {
  iconBoxStyle?: ViewStyle;
  size?: number;
  icon?: ReactNode;
}

export const DCRoundIcon = ({ icon, iconBoxStyle, size = 40 }: DCIconProps) => {
  const { styles } = useStyles(styleSheet);

  return (
    <View style={[styles.iconBox, iconBoxStyle, { width: size, height: size }]}>
      {icon}
    </View>
  );
};

const styleSheet = createStyleSheet(theming => ({
  iconBox: {
    backgroundColor: theming.colors.textPrimary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
