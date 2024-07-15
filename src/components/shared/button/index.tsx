import { theming } from 'common/constants/theming';
import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface DCButtonProps {
  title?: string;
  onPress?: () => void;
  leftIcon?: ReactNode;
  rigthIcon?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}
export const DCButton = ({
  title,
  onPress,
  leftIcon,
  rigthIcon,
  disabled = false,
  isLoading = false,
  containerStyle,
  textStyle,
}: DCButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[styles.wrapper, containerStyle]}>
      {isLoading ? (
        <ActivityIndicator size={'small'} />
      ) : (
        <>
          {leftIcon}
          {title && <Text style={[styles.title, textStyle]}>{title}</Text>}
          {rigthIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: theming.colors.darkGray,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theming.colors.textPrimary,
  },
});
