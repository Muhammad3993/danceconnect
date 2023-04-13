/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';

type ButtonProps = {
  title: string;
  onPress: () => {};
  disabled?: boolean;
  isLoading?: false;
};
export const Button = ({title, onPress, disabled, isLoading}: ButtonProps) => {
  return (
    <RN.TouchableOpacity
      onPress={onPress}
      disabled={!disabled}
      style={[
        styles.container,
        {
          backgroundColor: !disabled
            ? 'rgba(245, 168, 12, 0.6)'
            : colors.orange,
          flexDirection: isLoading ? 'row' : 'column',
        },
      ]}>
      <RN.Text style={styles.title}>{title}</RN.Text>
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
    backgroundColor: colors.orange,
    paddingVertical: 16,
    justifyContent: 'center',
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
  },
});
