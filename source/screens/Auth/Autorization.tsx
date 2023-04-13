import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigationParamList} from '../../navigation/types';
import AuthButton from '../../components/authBtn';
import {authButtons} from './btnsConstans';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Input} from '../../components/input';
import colors from '../../utils/colors';
import {Button} from '../../components/Button';
import useRegistration from '../../hooks/useRegistration';

const AuthorizationScreen = (): JSX.Element => {
  const navigation = useNavigation<AuthStackNavigationParamList>();
  const btns = authButtons.slice(0, 3);
  const {authorizaton, isLoading, saveEmail, userUid} = useRegistration();
  const [email, setEmail] = useState<string>(saveEmail ?? '');
  const [password, setPassword] = useState<string>('qwerty123');

  const goSignUp = () => {
    navigation.navigate('REGISTRATION');
  };
  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (userUid) {
      navigation.navigate('HOME');
      console.log(userUid);
    }
  }, [userUid, navigation]);
  const renderBackButton = () => {
    return (
      <RN.TouchableOpacity onPress={goBack} style={{paddingTop: 24}}>
        <RN.Image source={{uri: 'backicon'}} style={styles.icon} />
      </RN.TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      {renderBackButton()}
      <RN.KeyboardAvoidingView style={styles.container} behavior="height">
        <RN.View>
          <RN.Image
            source={require('../../assets/images/logoauth.png')}
            style={styles.logo}
          />
          <RN.Text style={styles.welcome}>Login</RN.Text>
          <Input
            value={email}
            onChange={(v: string) => setEmail(v)}
            placeholder="Email"
            keyboardType="email-address"
            iconName="inbox"
          />
          <Input
            value={password}
            onChange={(v: string) => setPassword(v)}
            placeholder="Password"
            keyboardType="default"
            iconName="lock"
            secureText
          />
          <Button
            title="Login"
            disabled={email.length > 0 && password.length > 0}
            onPress={async () => authorizaton(email, password)}
            isLoading={isLoading}
          />
          <RN.TouchableOpacity style={styles.recoveryPasswordBtn}>
            <RN.Text style={styles.recoveryPasswordText}>
              Forgot the password?
            </RN.Text>
          </RN.TouchableOpacity>
          <RN.View style={styles.linesWrapper}>
            <RN.View style={styles.line} />
            <RN.Text style={styles.or}>or continue with</RN.Text>
            <RN.View style={styles.line} />
          </RN.View>
          <RN.View style={styles.btnsWrapper}>
            {btns?.map(btn => {
              return (
                <AuthButton
                  icon={btn.icon}
                  key={btn.key}
                  onPress={btn?.onPress}
                />
              );
            })}
          </RN.View>
        </RN.View>

        <RN.View style={styles.bottomWrapper}>
          <RN.Text style={styles.alreadyAccountText}>
            Don’t have an account?
          </RN.Text>
          <RN.TouchableOpacity onPress={goSignUp}>
            <RN.Text style={styles.logInText}>Sign up</RN.Text>
          </RN.TouchableOpacity>
        </RN.View>
      </RN.KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
    flex: 1,
  },
  icon: {
    height: 20,
    width: 24,
    marginHorizontal: 30,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 14,
    justifyContent: 'space-between',
  },
  welcome: {
    fontSize: 32,
    textAlign: 'center',
    paddingTop: 41,
    paddingBottom: 36,
    fontFamily: 'Mulish',
  },
  logo: {
    height: 55,
    width: 200,
    marginTop: 84,
    marginBottom: 20,
    alignSelf: 'center',
  },
  linesWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    marginHorizontal: 12,
  },
  line: {
    height: 1,
    width: '30%',
    backgroundColor: colors.gray,
  },
  or: {
    fontSize: 16,
    lineHeight: 25.2,
    fontWeight: '400',
    paddingHorizontal: 16,
    color: colors.darkGray,
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
  btnsWrapper: {
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 30,
  },
  recoveryPasswordBtn: {
    alignItems: 'center',
    padding: 24,
  },
  recoveryPasswordText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
    color: colors.purple,
    fontFamily: 'Mulish',
  },
});
export default AuthorizationScreen;
