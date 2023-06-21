/* eslint-disable react-native/no-inline-styles */
import React, {useLayoutEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';

type InputProp = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  keyboardType?: RN.KeyboardTypeOptions;
  secureText?: boolean;
  iconName?: string;
  editable?: boolean;
  isErrorBorder?: boolean;
  maxLength?: number;
  multiLine?: boolean;
  autoComplete?: string;
};

export const Input = ({
  value,
  onChange,
  placeholder,
  keyboardType,
  secureText,
  iconName,
  isErrorBorder,
  editable = true,
  maxLength,
  multiLine = false,
  autoComplete,
}: InputProp) => {
  const [backgroundColor, setBackgroundColor] = useState(colors.lightGray);
  const [borderColor, setBorderColor] = useState(colors.gray);
  const [tintColor, setTintColor] = useState(colors.darkGray);
  const [tintColorEye, setTintColoEye] = useState(colors.darkGray);
  const [visiblePassword, setVisiblePassword] = useState(secureText);
  const isIconInbox = iconName === 'inbox';
  // const springAnimated = new RN.Animated.Value(-0.5);
  // const translateX = springAnimated.interpolate({
  //   inputRange: [-0.5, 0, 1, 1.5], // added more count
  //   outputRange: [0, -10, 10, 0],
  //   // outputRange: [0, -14, 14, 0],
  //   // extrapolate: 'identity',
  // });

  useLayoutEffect(() => {
    if (isErrorBorder) {
      setBorderColor(colors.redError);
      // RN.Animated.spring(springAnimated, {
      //   damping: 350,
      //   mass: 20,
      //   // stiffness: 100,
      //   overshootClamping: false,
      //   restSpeedThreshold: 0.0001,
      //   restDisplacementThreshold: 0.0001,
      //   useNativeDriver: true,
      //   toValue: 1.5,
      // }).start(() => setBorderColor(colors.gray));
    } else {
      setBorderColor(colors.gray);
    }
  }, [isErrorBorder]);

  const renderLeftIcon = () => {
    return (
      <RN.View style={styles.leftIconWrapper}>
        <RN.Image
          source={{uri: iconName}}
          style={[
            styles.leftIcon,
            {
              tintColor,
              height: isIconInbox ? 17 : 21,
              marginTop: isIconInbox ? 2 : 0,
            },
          ]}
        />
      </RN.View>
    );
  };
  const renderRightIcon = () => {
    return (
      <RN.TouchableOpacity
        style={styles.rightIconWrapper}
        onPress={() => setVisiblePassword(val => !val)}>
        <RN.Image
          source={{uri: 'eye'}}
          style={[styles.rightIcon, {tintColor: tintColorEye}]}
        />
      </RN.TouchableOpacity>
    );
  };

  const onFocus = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.linear);
    setBorderColor(colors.orange);
    setBackgroundColor(colors.tranparentOrange);
    setTintColoEye(colors.orange);
  };
  const onBlur = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.linear);
    setBorderColor(colors.gray);
    setBackgroundColor(colors.lightGray);
    setTintColoEye(colors.textPrimary);
  };
  const onChangeText = (text: string) => {
    onChange(text);
    if (text.length > 0) {
      setTintColor(colors.textPrimary);
    } else {
      setTintColor(colors.darkGray);
    }
  };
  return (
    <RN.View style={{marginHorizontal: 14}}>
      {/* <RN.Animated.View
      style={{
        transform: [{translateX}],
        marginHorizontal: 14,
      }}> */}
      {iconName && renderLeftIcon()}

      <RN.TextInput
        style={[
          styles.container,
          {borderColor, backgroundColor, paddingLeft: iconName ? 46 : 16},
        ]}
        maxLength={maxLength}
        editable={editable}
        value={value}
        secureTextEntry={visiblePassword}
        onChangeText={(val: string) => onChangeText(val)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onFocus={onFocus}
        placeholderTextColor={colors.darkGray}
        onBlur={onBlur}
        multiline={multiLine}
        autoComplete={autoComplete}
      />

      {secureText && renderRightIcon()}
      {/* </RN.Animated.View> */}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    // paddingLeft: 46,
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '400',
    letterSpacing: 0.2,
    marginBottom: 24,
  },
  leftIcon: {
    width: 18,
  },
  rightIcon: {
    height: 20,
    width: 20,
  },
  leftIconWrapper: {
    position: 'absolute',
    zIndex: 2,
    top: 22,
    paddingLeft: 16,
  },
  rightIconWrapper: {
    position: 'absolute',
    zIndex: 2,
    top: 22,
    paddingRight: 16,
    alignSelf: 'flex-end',
  },
});
