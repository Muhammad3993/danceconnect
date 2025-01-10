import { StyleSheet, View, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { theming } from 'common/constants/theming';

interface DCIconProps {
  iconBoxStyle?: ViewStyle;
  size?: number;
  icon?: ReactNode;
}

export const DCRoundIcon = ({ icon, iconBoxStyle, size = 40 }: DCIconProps) => {
  return (
    <View style={[styles.iconBox, iconBoxStyle, { width: size, height: size }]}>
      {icon}
    </View>
  );
};

const styles = StyleSheet.create({
  iconBox: {
    backgroundColor: theming.colors.textPrimary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
