import { StyleSheet, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import { theming } from 'common/constants/theming';
import { t } from 'i18next';

interface HeaderProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Header = ({ leftIcon, rightIcon }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={{ width: '20%' }}>{leftIcon}</View>
      <View style={{ width: '60%', alignItems: 'center' }}>
        <Text style={styles.title}>{t("create_your_event")}</Text>
      </View>
      <View style={{ width: '20%', alignItems: 'flex-end' }}>{rightIcon}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 48,
    paddingHorizontal: theming.spacing.LG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },
});
