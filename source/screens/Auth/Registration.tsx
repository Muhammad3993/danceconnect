import React, {useCallback, useEffect, useRef, useState} from 'react';
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

const RegistraionScreen = (): JSX.Element => {
  const navigation = useNavigation<AuthStackNavigationParamList>();
  const btns = authButtons.slice(0, 3);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {isErrors, clearErrors} = useRegistration();
  const errorViewHeight = new RN.Animated.Value(0);

  const translateY = errorViewHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, 24],
    extrapolate: 'clamp',
  });

  const {
    registration,
    isLoading,
    userUid,
    authorizationWithGoogle,
    isUserExists,
  } = useRegistration();
  const onPressLogin = () => {
    navigation.navigate('AUTH');
  };

  const goBack = () => {
    navigation.goBack();
  };

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

  const onPressSocial = (iconName: string) => {
    // console.log('on press', iconName);
    if (iconName === 'google') {
      authorizationWithGoogle();
    }
  };
  useEffect(() => {
    if (userUid && !isUserExists) {
      navigation.navigate('ONBOARDING');
    }
    if (isUserExists) {
      navigation.navigate('HOME');
    }
  }, [userUid, navigation, isUserExists]);

  const onPressSignUp = () => {
    registration(email, password);
  };

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
            <RN.Text style={styles.welcome}>Create New Account</RN.Text>
            <Input
              value={email}
              onChange={(v: string) => setEmail(v)}
              isErrorBorder={isErrors?.type?.includes('email')}
              placeholder="Email"
              keyboardType="email-address"
              iconName="inbox"
            />
            <RN.Animated.View
              style={{
                alignItems: 'center',
                marginBottom: translateY,
                // height: translateY,
              }}>
              <RN.Text style={{color: 'red'}}>{isErrors?.message}</RN.Text>
            </RN.Animated.View>
            <Input
              isErrorBorder={isErrors?.type?.includes('password')}
              value={password}
              onChange={(v: string) => setPassword(v)}
              placeholder="Password"
              keyboardType="default"
              iconName="lock"
              secureText
            />
            <Button
              title="Sign up"
              disabled={email.length > 0 && password.length > 0}
              onPress={() => onPressSignUp()}
              isLoading={isLoading}
            />
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
              Already have an account?
            </RN.Text>
            <RN.TouchableOpacity onPress={onPressLogin}>
              <RN.Text style={styles.logInText}>Log in</RN.Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 14,
    paddingHorizontal: 0,
    paddingBottom: 0,
    justifyContent: 'space-between',
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
});
export default RegistraionScreen;
