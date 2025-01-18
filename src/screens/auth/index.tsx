import { Image, ScrollView, Text, View } from 'react-native';
import React from 'react';
import { StackScreenProps } from '../interfaces';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DCButton } from 'components/shared/button';
import { useSocialBtns } from 'data/hooks/user';
import { images } from 'common/resources/images';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function AuthScreen({ navigation }: StackScreenProps<'auth'>) {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(styleSheet);
  const { socialButtons } = useSocialBtns();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <Image source={images.authLogo} style={styles.logo} />
      <Text style={styles.welcome}>{t('welcome_text')}</Text>
      {socialButtons?.map(btn => {
        if (!btn.isAvailable) {
          return null;
        }
        return (
          <DCButton
            size="large"
            variant="outlined"
            isLoading={btn.isLoading}
            key={btn.title}
            onPress={btn.onPress}
            leftIcon={
              <Image source={btn.icon} style={{ width: 24, height: 24 }} />
            }
            containerStyle={{ marginBottom: theme.spacing.MD }}>
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
        size="large"
        variant="outlined"
        containerStyle={{ marginVertical: theme.spacing.MD }}
        onPress={() => navigation.push('register')}>
        {t('auth_btn_email')}
      </DCButton>

      <View style={styles.bottomWrapper}>
        <Text style={styles.alreadyAccountText}>{t('already')}</Text>
        <TouchableOpacity onPress={() => navigation.push('login')}>
          <Text style={styles.logInText}>{t('login')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styleSheet = createStyleSheet((theming, { insets }) => ({
  root: {
    backgroundColor: theming.colors.white,
    paddingHorizontal: theming.spacing.LG,
  },
  container: {
    flex: 1,
    paddingTop:
      insets.top + theming.utils.getAdaptiveWidth(theming.spacing.LG * 5),
    paddingBottom: insets.bottom + theming.spacing.MD,
  },

  welcome: {
    fontSize: 32,
    textAlign: 'center',
    marginTop: theming.spacing.LG,
    marginBottom: theming.spacing.LG * 2,
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },

  logo: {
    height: 55,
    width: 200,
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
    marginTop: 'auto',
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
}));
