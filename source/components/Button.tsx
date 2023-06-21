/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  buttonStyle?: {};
  iconName?: string;
};
export const Button = ({
  title,
  onPress,
  disabled,
  isLoading,
  buttonStyle,
  iconName,
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
          flexDirection: isLoading || iconName ? 'row' : 'column',
          paddingVertical: buttonStyle?.paddingVertical ?? 16,
          paddingHorizontal: buttonStyle?.paddingHorizontal ?? 16,
          marginHorizontal: buttonStyle?.marginHorizontal ?? 14,
        },
      ]}>
      {iconName && (
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Image
            source={{uri: iconName}}
            style={{
              height: 20,
              width: 21,
              tintColor: colors.purple,
              marginRight: 12,
            }}
          />
        </RN.View>
      )}
      <RN.Text
        style={[
          styles.title,
          {
            color: buttonStyle?.color ?? colors.white,
            fontSize: buttonStyle?.fontSize ?? 16,
          },
        ]}>
        {title}
      </RN.Text>
      {/* {isLoading && (
        <RN.ActivityIndicator
          size={'small'}
          color={buttonStyle?.color ?? colors.white}
          style={styles.indicator}
        />
      )} */}
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    paddingVertical: 16,
    justifyContent: 'center',
    // marginHorizontal: 14,
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
