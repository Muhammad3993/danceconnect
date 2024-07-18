import { PropsWithChildren, ReactNode } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

export interface DCButtonProps extends PropsWithChildren {
  onPress?: () => void;
  leftIcon?: ReactNode;
  rigthIcon?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  variant?: DCButtonVariant;
  size?: DCButtonSize;
}

type DCButtonVariant = 'primary' | 'outlined';
type DCButtonSize = 'medium' | 'large';
