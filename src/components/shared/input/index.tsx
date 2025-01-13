import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { ReactNode, useMemo, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

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
  const ref = useRef<TextInput>(null);

  const { styles, theme } = useStyles(styleSheet);

  const [borderColor, setBorderColor] = useState<string>(theme.colors.gray);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setBorderColor(theme.colors.orange);
    if (onFocus) {
      onFocus(e);
    }
  };
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setBorderColor(theme.colors.gray);
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
      <View style={[styles.inner, { borderColor }, inputStyle]}>
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
          placeholderTextColor={theme.colors.gray}
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
        <Text style={{ color: theme.colors.error, marginTop: 4 }}>
          {errorText}
        </Text>
      )}
    </Pressable>
  );
};

const styleSheet = createStyleSheet(theming => ({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
  inner: {
    borderWidth: 1,
    borderRadius: 8,
    gap: 16,
    padding: 16,
    flexDirection: 'row',
    backgroundColor: theming.colors.lightGray,
  },
  input: {
    color: theming.colors.textPrimary,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.2,
    flex: 1,
  },
}));
