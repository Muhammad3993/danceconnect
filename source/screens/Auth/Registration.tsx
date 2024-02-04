import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigationParamList} from '../../navigation/types';
import AuthButton from '../../components/authBtn';
import {authButtons} from '../../utils/btnsConstans';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Input} from '../../components/input';
import colors from '../../utils/colors';
import {Button} from '../../components/Button';
import useRegistration from '../../hooks/useRegistration';
import useAppStateHook from '../../hooks/useAppState';
import {userExists} from '../../api/serverRequests';
import {useTranslation} from 'react-i18next';
const RegistraionScreen = (): JSX.Element => {
  const navigation = useNavigation<AuthStackNavigationParamList>();
  const btns = authButtons.slice(0, 2);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {isErrors, saveEmail} = useRegistration();
  const [errorExist, setErrorExist] = useState('');
  const errorViewHeight = new RN.Animated.Value(0);
  const {setLoading} = useAppStateHook();
  const {t} = useTranslation();
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
    authorizationWithApple,
  } = useRegistration();
  const onPressLogin = () => {
    navigation.navigate('AUTH');
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    // if (isErrors?.message?.length > 0) {
    //   RN.Animated.timing(errorViewHeight, {
    //     duration: 1000,
    //     toValue: 1,
    //     easing: RN.Easing.ease,
    //     useNativeDriver: false,
    //   }).start();
    // }
    setTimeout(() => {
      setErrorExist('');
    }, 3000);
  }, [errorExist]);

  // useEffect(() => {
  //   if (isErrors?.message?.length > 0) {
  //     setTimeout(() => {
  //       RN.Animated.timing(errorViewHeight, {
  //         duration: 1000,
  //         toValue: 0,
  //         useNativeDriver: false,
  //         easing: RN.Easing.ease,
  //       }).start();
  //     }, 4000);
  //     setTimeout(() => {
  //       clearErrors();
  //     }, 5000);
  //   }
  // }, [clearErrors, errorViewHeight, isErrors]);

  const onPressSocial = (iconName: string) => {
    // console.log('on press', iconName);
    // setLoading(true);
    if (iconName === 'google') {
      authorizationWithGoogle();
    }
    if (iconName === 'apple') {
      authorizationWithApple();
    }
  };
  // console.log(userUid, isUserExists)
  useEffect(() => {
    if (userUid && !isUserExists) {
      navigation.navigate('ONBOARDING', {email: saveEmail, password: userUid});
    }
    // if (isUserExists) {
    //   navigation.navigate('HOME');
    // }
  }, [userUid, navigation, isUserExists]);

  const onPressSignUp = () => {
    // setLoading(true);
    userExists(email)
      .then(res => {
        // console.log('res', res);
        if (!res) {
          navigation.navigate('ONBOARDING', {email, password});
        } else {
          setErrorExist('User already exist');
        }
      })
      .catch(er => console.log(er));
    // if (isExist) {
    //   console.log('isExist', isExist)
    // }
    //   console.log('isExist', isExist)
    // registration(email, password);
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
            <RN.Text style={styles.welcome}>{t('create_account')}</RN.Text>
            <Input
              value={email.toLowerCase()}
              onChange={setEmail}
              isErrorBorder={isErrors?.type?.includes('email')}
              placeholder={t('email')}
              keyboardType="email-address"
              iconName="inbox"
            />
            {errorExist?.length > 0 && (
              <RN.View style={styles.errorMessage}>
                <RN.Text style={styles.errorMessageText}>{errorExist}</RN.Text>
              </RN.View>
            )}
            <Input
              isErrorBorder={errorExist?.length > 0}
              value={password}
              onChange={(v: string) => setPassword(v)}
              placeholder={t('password')}
              keyboardType="default"
              iconName="lock"
              secureText
            />
            <Button
              title={t('sign_up')}
              disabled={email.length > 0 && password.length > 0}
              onPress={onPressSignUp}
              isLoading={isLoading}
            />
            <RN.View style={styles.linesWrapper}>
              <RN.View style={styles.line} />
              <RN.Text style={styles.or}>{t('or_continue')}</RN.Text>
              <RN.View style={styles.line} />
            </RN.View>
            {/* <RN.View style={{paddingTop: 24}}>
              <AuthButton
                title={authButtons[0].title}
                icon={authButtons[0].icon}
                key={authButtons[0].key}
                navigateTo={authButtons[0].navigateTo}
              />
            </RN.View> */}
            <RN.View style={styles.btnsWrapper}>
              {btns?.map(btn => {
                if (!btn?.isAvailable) {
                  return null;
                }
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
            <RN.Text style={styles.alreadyAccountText}>{t('already')}</RN.Text>
            <RN.TouchableOpacity onPress={onPressLogin}>
              <RN.Text style={styles.logInText}>{t('login')}</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
          <RN.View style={{paddingHorizontal: 20}}>
            <RN.Text style={styles.licenceText}>
              {t('terms_first')}
              <RN.Text
                style={styles.licenceTextOrange}
                onPress={() =>
                  RN.Linking.openURL('https://danceconnect.online/terms.html')
                }>
                {' '}
                {t('terms_second')}
              </RN.Text>
            </RN.Text>
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
  licenceText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: colors.darkGray,
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    marginHorizontal: 40,
  },
  licenceTextOrange: {
    color: colors.orange,
    fontSize: 14,
    lineHeight: 20,
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
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  welcome: {
    fontSize: 32,
    textAlign: 'center',
    paddingTop: 41,
    paddingBottom: 36,
    fontFamily: 'Lato-Regular',
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
    fontFamily: 'Lato-Regular',
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
    fontFamily: 'Lato-Regular',
  },
  logInText: {
    paddingLeft: 8,
    color: colors.orange,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: 'Lato-Regular',
  },
  btnsWrapper: {
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 30,
  },
});
export default RegistraionScreen;
