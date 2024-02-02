import React, {useEffect} from 'react';
import * as RN from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigationParamList} from '../../navigation/types';
// import {authButtons} from '../../utils/btnsConstans';
import AuthButton from '../../components/authBtn';
import colors from '../../utils/colors';
import useRegistration from '../../hooks/useRegistration';
import {SCREEN_HEIGHT, isAndroid} from '../../utils/constants';
import useAppStateHook from '../../hooks/useAppState';
import {useTranslation} from 'react-i18next';
import {onAppleButtonPress} from '../../api/authSocial';

const WeclomeScreen = (): JSX.Element => {
  const navigation = useNavigation<AuthStackNavigationParamList>();
  const {t} = useTranslation();
  const authButtons = [
    {
      key: 0,
      title: t('auth_btn_goolge'),
      icon: 'google',
      isAvailable: true,
    },
    {
      key: 1,
      title: t('auth_btn_apple'),
      icon: 'apple',
      onPress: () => onAppleButtonPress(),
      isAvailable: !isAndroid,
    },
    // {
    //   key: 2,
    //   title: 'Continue with Facebook',
    //   icon: 'facebook',
    //   isAvailable: false,
    //   // onPress: () => onFacebookButtonPress(),
    // },
    {
      key: 2,
      title: t('auth_btn_email'),
      // title: 'Sign up with Email',
      icon: 'mail',
      navigateTo: 'REGISTRATION',
      isAvailable: true,
    },
  ];

  const btns = authButtons.slice(0, 2);
  const lastBtn = authButtons[authButtons.length - 1];
  const {
    authorizationWithGoogle,
    userUid,
    isUserExists,
    authorizationWithApple,
    saveEmail,
  } = useRegistration();
  const {setLoading, getDanceStyles} = useAppStateHook();
  useEffect(() => {
    getDanceStyles();
  }, []);

  const onPressLogin = () => {
    navigation.navigate('AUTH');
  };

  const onPressChangeLG = () => {
    navigation.navigate('LANGUAGE');
  };
  useEffect(() => {
    if (userUid && !isUserExists) {
      navigation.navigate('ONBOARDING', {email: saveEmail, password: userUid});
    }
    if (isUserExists) {
      navigation.navigate('HOME');
    }
    // console.log('isUserExists', isUserExists, userUid);
  }, [userUid, navigation, isUserExists]);
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
  return (
    <RN.SafeAreaView style={styles.container}>
      <RN.ScrollView showsVerticalScrollIndicator={false}>
        <RN.View>
          <RN.Image
            source={require('../../assets/images/logoauth.png')}
            style={styles.logo}
          />
          <RN.Text style={styles.welcome}>{t('welcome_text')}</RN.Text>
          {btns?.map(btn => {
            return (
              <AuthButton
                title={btn.title}
                icon={btn.icon}
                key={btn.key}
                onPress={() => onPressSocial(btn.icon)}
                isAvailable={btn?.isAvailable}
              />
            );
          })}
          <RN.View style={styles.linesWrapper}>
            <RN.View style={styles.line} />
            <RN.Text style={styles.or}>{t('or')}</RN.Text>
            <RN.View style={styles.line} />
          </RN.View>
          <RN.View style={{paddingTop: 24}}>
            <AuthButton
              title={lastBtn.title}
              icon={lastBtn.icon}
              key={lastBtn.key}
              navigateTo={lastBtn.navigateTo}
            />
            <RN.Text
              style={styles.privacyP}
              onPress={() =>
                RN.Linking.openURL('https://danceconnect.online/privacy.html')
              }>
              {t('privacy')}
            </RN.Text>
          </RN.View>
        </RN.View>
        <RN.View style={styles.bottomWrapper}>
          <RN.Text style={styles.alreadyAccountText}>{t('already')}</RN.Text>
          <RN.TouchableOpacity onPress={onPressLogin}>
            <RN.Text style={styles.logInText}>{t('login')}</RN.Text>
          </RN.TouchableOpacity>
        </RN.View>
        {/* 
        <RN.View style={styles.bottomWrapperLg}>
          <RN.Text style={styles.alreadyAccountText}>{t('language')}</RN.Text>
          <RN.TouchableOpacity onPress={onPressChangeLG}>
            <RN.Text style={styles.logInText}>{t('languageName')}</RN.Text>
          </RN.TouchableOpacity>
        </RN.View> */}

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
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // padding: 14,
    paddingTop: 0,
    justifyContent: 'space-between',
  },
  privacyP: {
    textAlign: 'center',
    color: colors.orange,
    fontSize: 14,
    lineHeight: 20,
    paddingTop: 8,
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
  welcome: {
    fontSize: 32,
    textAlign: 'center',
    paddingTop: 41,
    paddingBottom: 36,
    fontFamily: 'Lato-Regular',
    color: colors.textPrimary,
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
    marginTop: SCREEN_HEIGHT / 10,
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
    fontFamily: 'Lato-Regular',
    color: colors.darkGray,
  },
  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 100,
    paddingBottom: 20,
  },
  bottomWrapperLg: {
    flexDirection: 'row',
    justifyContent: 'center',
    // paddingTop: 100,
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
});
export default WeclomeScreen;
