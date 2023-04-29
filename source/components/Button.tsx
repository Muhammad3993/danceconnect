/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';

type ButtonProps = {
  title: string;
  onPress: () => {};
  disabled?: boolean;
  isLoading?: false;
  buttonStyle?: {};
};
export const Button = ({
  title,
  onPress,
  disabled,
  isLoading,
  buttonStyle,
}: ButtonProps) => {
  return (
    <RN.TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!disabled}
      style={[
        buttonStyle,
        styles.container,
        {
          backgroundColor: !disabled
            ? 'rgba(245, 168, 12, 0.6)'
            : buttonStyle?.backgroundColor ?? colors.orange,
          flexDirection: isLoading ? 'row' : 'column',
        },
      ]}>
      <RN.Text
        style={[
          styles.title,
          {
            color: buttonStyle?.color ?? colors.white,
          },
        ]}>
        {title}
      </RN.Text>
      {isLoading && (
        <RN.ActivityIndicator
          size={'small'}
          color={colors.white}
          style={styles.indicator}
        />
      )}
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    paddingVertical: 16,
    justifyContent: 'center',
    marginHorizontal: 14,
    borderRadius: 100,
  },
  indicator: {
    marginLeft: 14,
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
