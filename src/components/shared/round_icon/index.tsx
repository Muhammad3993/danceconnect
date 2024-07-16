import { StyleSheet, View, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { theming } from 'common/constants/theming';

interface DCIconProps {
  iconBoxStyle?: ViewStyle;
  icon?: ReactNode;
}

export const DCRoundIcon = ({ icon, iconBoxStyle }: DCIconProps) => {
  return <View style={[styles.iconBox, iconBoxStyle]}>{icon}</View>;
};

const styles = StyleSheet.create({
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: theming.colors.textPrimary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
