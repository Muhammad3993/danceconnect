import { theming } from 'common/constants/theming';
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { DCButtonProps } from './interfaces';

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
                variant === 'primary' ? styles.title : styles.titleOutlined,
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

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  btnMd: { height: 46 },
  btnLg: { height: 54 },
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
    borderColor: theming.colors.purple,
    borderWidth: 1,
  },

  btnDisabled: {
    opacity: 0.6,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theming.colors.white,
    fontFamily: theming.fonts.latoRegular,
  },
  titleOutlined: {
    fontSize: 16,
    fontWeight: '600',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
  },
});
