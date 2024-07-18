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
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.btn,
        variant === 'primary' ? styles.btnPrimary : styles.btnOutlined,
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
  },
  btnMd: { height: 48 },
  btnLg: { height: 58 },
  btnOutlined: {
    borderWidth: 1,
    borderColor: theming.colors.darkGray,
    borderRadius: 16,
  },
  btnPrimary: {
    borderRadius: 100,
    backgroundColor: theming.colors.orange,
  },

  btnDisabled: {
    opacity: 0.6,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theming.colors.white,
  },
  titleOutlined: {
    fontSize: 16,
    fontWeight: '600',
    color: theming.colors.textPrimary,
  },
});
