/* eslint-disable react-native/no-inline-styles */
import React, {useMemo} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';

export enum ButtonVariant {
  primary,
  outlined,
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  buttonStyle?: RN.ViewStyle & RN.TextStyle;
  iconName?: string;
  variant?: ButtonVariant;
  iconColor?: string;
  iconSize?: number;
};
export const Button = ({
  title,
  onPress,
  disabled,
  isLoading,
  buttonStyle,
  iconName,
  variant = ButtonVariant.primary,
  iconColor = colors.purple,
  iconSize = 20,
}: ButtonProps) => {
  const backgroundColor = useMemo(() => {
    if (!disabled) {
      return 'rgba(245, 168, 12, 0.6)';
    }

    if (buttonStyle?.backgroundColor) {
      return buttonStyle?.backgroundColor;
    }

    if (variant === ButtonVariant.outlined) {
      return 'transparent';
    }
    return colors.orange;
  }, [disabled, buttonStyle, variant]);

  const textColor = useMemo(() => {
    if (buttonStyle?.color) {
      return buttonStyle?.color;
    }

    if (variant === ButtonVariant.outlined) {
      return colors.purple;
    }
    return colors.white;
  }, [buttonStyle, variant]);

  return (
    <RN.TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!disabled}
      style={[
        styles.container,
        buttonStyle,
        {backgroundColor: backgroundColor},
        variant === ButtonVariant.outlined && styles.containerOutlined,
      ]}>
      {isLoading ? (
        <RN.ActivityIndicator
          size={'small'}
          color={buttonStyle?.color ?? colors.white}
        />
      ) : (
        <>
          {iconName && (
            <RN.Image
              source={{uri: iconName}}
              style={{
                height: iconSize,
                width: iconSize,
                tintColor: iconColor,
                marginRight: 8,
              }}
            />
          )}
          <RN.Text
            style={[
              styles.title,
              {color: textColor, fontSize: buttonStyle?.fontSize ?? 16},
            ]}>
            {title}
          </RN.Text>
        </>
      )}
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 14,
  },

  containerOutlined: {
    borderWidth: 1,
    borderColor: colors.gray300,
  },

  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    textAlign: 'center',
    fontFamily: 'Mulish-Light',
  },
});
