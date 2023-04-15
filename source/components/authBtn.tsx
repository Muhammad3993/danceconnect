import React from 'react';
import * as RN from 'react-native';
import {getLogoImg} from '../../utils';
import {useNavigation} from '@react-navigation/native';
import colors from '../utils/colors';

type authType = {
  title?: string;
  onPress?: () => void;
  navigateTo?: string;
  icon?: string;
};
const AuthButton = ({title, onPress, icon, navigateTo}: authType) => {
  const navigation = useNavigation();

  const onPressBtn = () => {
    if (navigateTo) {
      navigation.navigate(navigateTo);
    } else {
      onPress();
    }
  };
  if (!title) {
    return (
      <RN.TouchableOpacity onPress={onPressBtn} style={styles.noTitleBtn}>
        <RN.Image source={getLogoImg(icon)} style={styles.logotype} />
      </RN.TouchableOpacity>
    );
  }
  return (
    <RN.TouchableOpacity onPress={onPressBtn} style={styles.wrapper}>
      <RN.Image source={getLogoImg(icon)} style={styles.logotype} />
      <RN.Text style={styles.title}>{title}</RN.Text>
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: colors.darkGray,
    marginTop: 14,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  logotype: {
    width: 24,
    height: 24,
    // marginRight: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
    letterSpacing: 0.2,
    paddingLeft: 14,
    color: colors.textPrimary,
  },
  noTitleBtn: {
    borderWidth: 1,
    borderColor: colors.darkGray,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 18,
  },
});

export default AuthButton;
