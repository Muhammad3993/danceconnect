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
import {forgotPassword} from '../../api/authSocial';
import useAppStateHook from '../../hooks/useAppState';

const AuthorizationScreen = (): JSX.Element => {
  const navigation = useNavigation<AuthStackNavigationParamList>();
  const btns = authButtons.slice(0, 3);
  const {
    authorizaton,
    isLoading,
    isUserExists,
    userUid,
    authorizationWithGoogle,
    isErrors,
    clearErrors,
  } = useRegistration();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {setLoading} = useAppStateHook();
  const errorViewHeight = new RN.Animated.Value(0);

  const translateY = errorViewHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, 24],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    if (isErrors?.message?.length > 0) {
      RN.Animated.timing(errorViewHeight, {
        duration: 1000,
        toValue: 1,
        easing: RN.Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  }, [clearErrors, errorViewHeight, isErrors]);

  useEffect(() => {
    if (isErrors?.message?.length > 0) {
      setTimeout(() => {
        RN.Animated.timing(errorViewHeight, {
          duration: 1000,
          toValue: 0,
          useNativeDriver: false,
          easing: RN.Easing.ease,
        }).start();
      }, 4000);
      setTimeout(() => {
        clearErrors();
      }, 5000);
    }
  }, [clearErrors, errorViewHeight, isErrors]);

  const goSignUp = () => {
    navigation.navigate('REGISTRATION');
  };
  const goBack = () => {
    navigation.goBack();
  };

  const onPressSocial = (iconName: string) => {
    // console.log('on press', iconName);
    setLoading(true);
    if (iconName === 'google') {
      authorizationWithGoogle();
    }
  };
  const resetPassword = () => {
    console.log('resetPassword');
    // forgotPassword(email);
  };
  const onPressLogin = async () => {
    setLoading(true);
    authorizaton(email, password);
  };

  useEffect(() => {
    if (userUid && !isUserExists) {
      navigation.navigate('ONBOARDING');
    }
    if (isUserExists) {
      navigation.navigate('HOME');
    }
  }, [userUid, navigation, isUserExists]);
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
        <RN.ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <RN.View>
            <RN.Image
              source={require('../../assets/images/logoauth.png')}
              style={styles.logo}
            />
            <RN.Text style={styles.welcome}>Login</RN.Text>
            <Input
              autoComplete={'email'}
              isErrorBorder={isErrors?.type?.includes('email')}
              value={email.toLowerCase()}
              onChange={(v: string) => setEmail(v)}
              placeholder="Email"
              keyboardType="email-address"
              iconName="inbox"
            />
            {isErrors?.message?.length > 0 && (
              <RN.View style={styles.errorMessage}>
                <RN.Text style={styles.errorMessageText}>
                  {isErrors?.message}
                </RN.Text>
              </RN.View>
            )}
            <Input
              value={password}
              onChange={(v: string) => setPassword(v)}
              isErrorBorder={isErrors?.type?.includes('password')}
              placeholder="Password"
              keyboardType="default"
              iconName="lock"
              secureText
            />
            <Button
              title="Login"
              disabled={email.length > 0 && password.length > 0}
              onPress={onPressLogin}
              isLoading={isLoading}
            />
            {/* <RN.TouchableOpacity
              disabled={email?.length <= 0}
              style={styles.recoveryPasswordBtn}
              onPress={resetPassword}>
              <RN.Text style={styles.recoveryPasswordText}>
                Forgot the password?
              </RN.Text>
            </RN.TouchableOpacity> */}
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
                    onPress={() => onPressSocial(btn.icon)}
                    isAvailable={btn?.isAvailable}
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
        </RN.ScrollView>
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
  errorMessage: {
    marginTop: -16,
    paddingBottom: 6,
    alignItems: 'center',
  },
  errorMessageText: {
    color: colors.redError,
    fontSize: 13,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 14,
    paddingHorizontal: 0,
    justifyContent: 'space-between',
    paddingBottom: 0,
  },
  welcome: {
    fontSize: 32,
    textAlign: 'center',
    paddingTop: 41,
    paddingBottom: 36,
    fontFamily: 'Mulish',
    color: colors.textPrimary,
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
    paddingTop: 65,
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
    paddingTop: 60,
    paddingBottom: 40,
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
