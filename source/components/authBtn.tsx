import React from 'react';
import * as RN from 'react-native';
import {getLogoImg} from '../../utils';

type authType = {
  title: string;
  onPress?: () => void;
  icon?: string;
};
const AuthButton = ({title, onPress, icon}: authType) => {
  return (
    <RN.TouchableOpacity onPress={onPress} style={styles.wrapper}>
      <RN.Image source={getLogoImg(icon)} style={styles.logotype} />
      <RN.Text style={styles.title}>{title}</RN.Text>
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logotype: {
    width: 24,
    height: 24,
    marginRight: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
});

export default AuthButton;
