import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { DCButtonProps } from './interfaces';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const DCButton = ({
  children,
  onPress,
  leftIcon,
  rigthIcon,
  disabled = false,
  isLoading = false,
  containerStyle,
  textStyle,
  variant = 'primary',
  size = 'medium',
}: DCButtonProps) => {
  const { styles, theme } = useStyles(styleSheet);

  const variantStyle = {
    primary: styles.btnPrimary,
    outlined: styles.btnOutlined,
    secondary: styles.btnSecondary,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.btn,
        variantStyle[variant],
        size === 'medium' ? styles.btnMd : styles.btnLg,
        disabled && styles.btnDisabled,
        containerStyle,
      ]}>
      {isLoading ? (
        <ActivityIndicator size={'small'} />
      ) : (
        <>
          {leftIcon}
          {typeof children === 'string' ? (
            <Text
              style={[
                styles.title,
                {
                  color:
                    variant === 'primary'
                      ? theme.colors.white
                      : theme.colors.textPrimary,
                },
                textStyle,
              ]}>
              {children}
            </Text>
          ) : (
            children
          )}
          {rigthIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styleSheet = createStyleSheet(theming => ({
  btn: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  btnMd: {
    height: {
      xs: 42,
      sm: 46,
    },
  },
  btnLg: {
    height: {
      xs: 50,
      sm: 54,
    },
  },
  btnOutlined: {
    borderWidth: 1,
    borderColor: theming.colors.gray300,
    borderRadius: 16,
  },
  btnPrimary: {
    borderRadius: 100,
    backgroundColor: theming.colors.orange,
  },

  btnSecondary: {
    borderRadius: 100,
    borderColor: theming.colors.secondary500,
    borderWidth: 1,
  },

  btnDisabled: {
    opacity: 0.6,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: theming.fonts.latoRegular,
  },
}));
