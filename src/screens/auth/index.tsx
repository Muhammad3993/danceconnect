import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { StackScreenProps } from '../interfaces';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DCButton } from 'components/shared/button';
import { theming } from 'common/constants/theming';
import { useSocialBtns } from 'data/hooks/user';
import { images } from 'common/resources/images';
import { SCREEN_HEIGHT } from 'common/constants';

export function AuthScreen({ navigation }: StackScreenProps<'auth'>) {
  const { t } = useTranslation();
  const { socialButtons } = useSocialBtns();

  return (
    <ScrollView
      style={{
        backgroundColor: theming.colors.white,
        padding: theming.spacing.LG,
      }}
      showsVerticalScrollIndicator={false}>
      <Image source={images.authLogo} style={styles.logo} />
      <Text style={styles.welcome}>{t('welcome_text')}</Text>
      {socialButtons?.map(btn => {
        if (!btn.isAvailable) {
          return null;
        }
        return (
          <DCButton
            isLoading={btn.isLoading}
            key={btn.title}
            onPress={btn.onPress}
            containerStyle={{ marginBottom: theming.spacing.MD }}>
            {btn.title}
          </DCButton>
        );
      })}
      <View style={styles.linesWrapper}>
        <View style={styles.line} />
        <Text style={styles.or}>{t('or')}</Text>
        <View style={styles.line} />
      </View>
      <DCButton
        containerStyle={{ marginTop: theming.spacing.MD }}
        onPress={() => navigation.push('register')}>
        {t('auth_btn_email')}
      </DCButton>
      <Text
        style={styles.privacyP}
        onPress={() =>
          Linking.openURL('https://danceconnect.online/privacy.html')
        }>
        {t('privacy')}
      </Text>
      <View style={styles.bottomWrapper}>
        <Text style={styles.alreadyAccountText}>{t('already')}</Text>
        <TouchableOpacity onPress={() => navigation.push('login')}>
          <Text style={styles.logInText}>{t('login')}</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.licenceText}>
          {t('terms_first')}
          <Text
            style={styles.licenceTextOrange}
            onPress={() =>
              Linking.openURL('https://danceconnect.online/terms.html')
            }>
            {' '}
            {t('terms_second')}
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theming.colors.white,
    justifyContent: 'space-between',
  },
  privacyP: {
    textAlign: 'center',
    color: theming.colors.orange,
    fontSize: 14,
    lineHeight: 20,
    paddingTop: 8,
  },
  licenceText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: theming.colors.darkGray,
    fontFamily: theming.fonts.latoRegular,
    textAlign: 'center',
  },
  licenceTextOrange: {
    color: theming.colors.orange,
    fontSize: 14,
    lineHeight: 20,
  },
  welcome: {
    fontSize: 32,
    textAlign: 'center',
    paddingTop: 41,
    paddingBottom: 36,
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },
  btn: {
    margin: 14,
    backgroundColor: theming.colors.lightGray,
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
  },
  line: {
    height: 1,
    width: '40%',
    backgroundColor: theming.colors.gray,
  },
  or: {
    fontSize: 18,
    lineHeight: 25.2,
    fontWeight: '600',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.darkGray,
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
    color: theming.colors.darkGray,
    fontFamily: theming.fonts.latoRegular,
  },
  logInText: {
    marginLeft: 8,
    color: theming.colors.orange,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: theming.fonts.latoRegular,
  },
});
