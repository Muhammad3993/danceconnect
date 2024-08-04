import { theming } from 'common/constants/theming';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface CustomCheckBoxProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  containerStyle?: ViewStyle;
}

export const CustomCheckBox = ({ value, onValueChange, containerStyle }: CustomCheckBoxProps) => {
  return (
    <TouchableOpacity
      style={[containerStyle]}
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.checkbox, value && styles.checkedCheckbox]}>
        {value && <View style={styles.checkmark} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: theming.colors.orange,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: theming.colors.lightOrange,
  },
  checkedCheckbox: {
    backgroundColor: '#FFF8ED',
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: theming.colors.orange,
    borderRadius: 50,
    position: "relative",
    left: -.05
  },
  label: {
    fontSize: 16,
  },
});
