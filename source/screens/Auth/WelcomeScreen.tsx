import React, {useEffect} from 'react';
import * as RN from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigationParamList} from '../../navigation/types';
import {authButtons} from './btnsConstans';
import AuthButton from '../../components/authBtn';
import colors from '../../utils/colors';
import useRegistration from '../../hooks/useRegistration';
import {SCREEN_HEIGHT} from '../../utils/constants';
import useAppStateHook from '../../hooks/useAppState';

const WeclomeScreen = (): JSX.Element => {
  const navigation = useNavigation<AuthStackNavigationParamList>();
  const btns = authButtons.slice(0, 2);
  const lastBtn = authButtons[authButtons.length - 1];
  const {
    authorizationWithGoogle,
    userUid,
    isUserExists,
    authorizationWithApple,
  } = useRegistration();
  const {setLoading} = useAppStateHook();

  const onPressLogin = () => {
    navigation.navigate('AUTH');
  };
  useEffect(() => {
    if (userUid && !isUserExists) {
      navigation.navigate('ONBOARDING');
    }
    if (isUserExists) {
      navigation.navigate('HOME');
    }
    console.log('isUserExists', isUserExists);
  }, [userUid, navigation, isUserExists]);
  const onPressSocial = (iconName: string) => {
    // console.log('on press', iconName);
    setLoading(true);
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
          <RN.Text style={styles.welcome}>Where dance meets community</RN.Text>
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
            <RN.Text
              style={styles.privacyP}
              onPress={() =>
                RN.Linking.openURL('https://www.danceconnect.online/privacy')
              }>
              Privacy Policy
            </RN.Text>
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

        <RN.View style={{paddingHorizontal: 20}}>
          <RN.Text style={styles.licenceText}>
            By registering in the application, you agree to the
            <RN.Text
              style={styles.licenceTextOrange}
              onPress={() =>
                RN.Linking.openURL('https://www.danceconnect.online/terms')
              }>
              {' '}
              terms and conditions
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
    fontFamily: 'Mulish',
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
    fontFamily: 'Mulish',
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
    fontFamily: 'Mulish',
    color: colors.darkGray,
  },
  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 100,
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
});
export default WeclomeScreen;
