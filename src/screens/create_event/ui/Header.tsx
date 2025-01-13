import { StyleSheet, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface HeaderProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Header = ({ leftIcon, rightIcon }: HeaderProps) => {
  const { t } = useTranslation();
  const { styles } = useStyles(styleSheet);

  return (
    <View style={styles.container}>
      <View style={{ width: '20%' }}>{leftIcon}</View>
      <View style={{ width: '60%', alignItems: 'center' }}>
        <Text style={styles.title}>{t('create_your_event')}</Text>
      </View>
      <View style={{ width: '20%', alignItems: 'flex-end' }}>{rightIcon}</View>
    </View>
  );
};

const styleSheet = createStyleSheet(theming => ({
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
}));
