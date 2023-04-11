import React from 'react';
import * as RN from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigationParamList} from '../../navigation/types';
import {authButtons} from './btnsConstans';
import AuthButton from '../../components/authBtn';

const AuthorizationScreen = (): JSX.Element => {
  const navigation = useNavigation<AuthStackNavigationParamList>();
  const btns = authButtons.slice(0, 3);
  const lastBtn = authButtons[authButtons.length - 1];

  const goToRegistr = () => {
    navigation.navigate('REGISTRATION');
  };
  return (
    <RN.View style={styles.container}>
      <RN.Image
        source={require('../../assets/images/logoauth.png')}
        style={styles.logo}
      />
      <RN.Text style={styles.welcome}>Where dance meets community</RN.Text>
      {btns?.map(btn => {
        return <AuthButton title={btn.title} icon={btn.icon} key={btn.key} />;
      })}
      <RN.View style={styles.bottomWrapper}>
        <RN.View style={styles.line} />
        <RN.Text style={styles.or}>or</RN.Text>
        <RN.View style={styles.line} />
      </RN.View>
      <RN.View style={{paddingTop: 24}}>
        <AuthButton
          title={lastBtn.title}
          icon={lastBtn.icon}
          key={lastBtn.key}
        />
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 14,
  },
  welcome: {
    fontSize: 32,
    textAlign: 'center',
    paddingTop: 41,
    paddingBottom: 36,
  },
  btn: {
    margin: 14,
    backgroundColor: 'lightgray',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  logo: {
    height: 65,
    width: 238,
    marginTop: 124,
    alignSelf: 'center',
  },
  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 34,
  },
  line: {
    height: 1,
    width: '45%',
    backgroundColor: '#EEEEEE',
  },
  or: {
    fontSize: 18,
    lineHeight: 25.2,
    fontWeight: '600',
    paddingHorizontal: 16,
  },
});
export default AuthorizationScreen;
