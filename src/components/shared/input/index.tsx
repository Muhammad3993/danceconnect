import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { theming } from 'common/constants/theming';
import React, { ReactNode, useMemo, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface DCInputProps extends TextInputProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: TextStyle;
  errorText?: string;
  forBottomSheet?: boolean;
}

export const DCInput = ({
  value,
  placeholder,
  keyboardType,
  leftIcon,
  editable = true,
  maxLength,
  autoComplete,
  autoFocus = false,
  onFocus,
  containerStyle,
  inputStyle,
  numberOfLines,
  rightIcon,
  secureTextEntry,
  onChangeText,
  errorText,
  forBottomSheet = false,
  onBlur,
}: DCInputProps) => {
  const ref = useRef<TextInput>();
  const [backgroundColor, setBackgroundColor] = useState(
    theming.colors.lightGray,
  );
  const [borderColor, setBorderColor] = useState(theming.colors.gray);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setBorderColor(theming.colors.orange);
    setBackgroundColor(theming.colors.tranparentOrange);
    if (onFocus) {
      onFocus(e);
    }
  };
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setBorderColor(theming.colors.gray);
    setBackgroundColor(theming.colors.lightGray);
    if (onBlur) {
      onBlur(e);
    }
  };

  const Input = useMemo(
    () => (forBottomSheet ? BottomSheetTextInput : TextInput),
    [forBottomSheet],
  );

  return (
    <Pressable
      onPress={() => ref.current?.focus()}
      style={[styles.container, containerStyle]}>
      <View
        style={[styles.inner, { backgroundColor, borderColor }, inputStyle]}>
        {leftIcon}

        <Input
          style={styles.input}
          maxLength={maxLength}
          editable={editable}
          value={value}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          placeholderTextColor={theming.colors.grayScale}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          numberOfLines={numberOfLines}
          keyboardBlurBehavior="restore"
          ref={ref}
        />

        {rightIcon}
      </View>
      {errorText && (
        <Text style={{ color: theming.colors.redError, marginTop: 4 }}>
          {errorText}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  inner: {
    borderWidth: 1,
    borderRadius: 8,
    gap: 16,
    padding: 16,
  },
  input: {
    color: theming.colors.textPrimary,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});
