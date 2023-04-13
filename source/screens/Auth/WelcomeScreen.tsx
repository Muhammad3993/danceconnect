import React from 'react';
import * as RN from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigationParamList} from '../../navigation/types';
import {authButtons} from './btnsConstans';
import AuthButton from '../../components/authBtn';
import colors from '../../utils/colors';

const WeclomeScreen = (): JSX.Element => {
  const navigation = useNavigation<AuthStackNavigationParamList>();
  const btns = authButtons.slice(0, 3);
  const lastBtn = authButtons[authButtons.length - 1];

  const onPressLogin = () => {
    navigation.navigate('AUTH');
  };
  return (
    <RN.View style={styles.container}>
      <RN.View>
        <RN.Image
          source={require('../../assets/images/logoauth.png')}
          style={styles.logo}
        />
        <RN.Text style={styles.welcome}>Where dance meets community</RN.Text>
        {btns?.map(btn => {
          return (
            <AuthButton
              title={btn.title}
              icon={btn.icon}
              key={btn.key}
              onPress={btn?.onPress}
            />
          );
        })}
        <RN.View style={styles.linesWrapper}>
          <RN.View style={styles.line} />
          <RN.Text style={styles.or}>or</RN.Text>
          <RN.View style={styles.line} />
        </RN.View>
        <RN.View style={{paddingTop: 24}}>
          <AuthButton
            title={lastBtn.title}
            icon={lastBtn.icon}
            key={lastBtn.key}
            navigateTo={lastBtn.navigateTo}
          />
        </RN.View>
      </RN.View>

      <RN.View style={styles.bottomWrapper}>
        <RN.Text style={styles.alreadyAccountText}>
          Already have an account?
        </RN.Text>
        <RN.TouchableOpacity onPress={onPressLogin}>
          <RN.Text style={styles.logInText}>Log in</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 14,
    justifyContent: 'space-between',
    paddingBottom: 44,
  },
  welcome: {
    fontSize: 32,
    textAlign: 'center',
    paddingTop: 41,
    paddingBottom: 36,
    fontFamily: 'Mulish',
  },
  btn: {
    margin: 14,
    backgroundColor: colors.lightGray,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  logo: {
    height: 55,
    width: 200,
    marginTop: 124,
    alignSelf: 'center',
  },
  linesWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 34,
    marginHorizontal: 12,
  },
  line: {
    height: 1,
    width: '40%',
    backgroundColor: colors.gray,
  },
  or: {
    fontSize: 18,
    lineHeight: 25.2,
    fontWeight: '600',
    paddingHorizontal: 16,
    fontFamily: 'Mulish',
  },
  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  alreadyAccountText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: colors.darkGray,
    fontFamily: 'Mulish',
  },
  logInText: {
    paddingLeft: 8,
    color: colors.orange,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: 'Mulish',
  },
});
export default WeclomeScreen;
