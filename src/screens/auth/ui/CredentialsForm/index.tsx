import {
  Image,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  Text,
  View,
} from 'react-native';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { DCInput } from 'components/shared/input';
import { DCButton } from 'components/shared/button';
import { useSocialBtns } from 'data/hooks/user';
import { images } from 'common/resources/images';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmptyObj } from 'common/utils/object';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { authSchema, AuthSchema } from 'data/api/user/schema';

interface Props {
  footerComponent: ReactNode;
  submitTitle: string;
  isLoading: boolean;
  onSubmit: (data: AuthSchema) => void;
  title: string;
}

export function CredentialsForm({
  footerComponent,
  submitTitle,
  isLoading,
  onSubmit,
  title,
}: Props) {
  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(authSchema),
  });
  const { dirtyFields } = formState;
  const { socialButtons } = useSocialBtns();
  const { styles, theme } = useStyles(styleSheet);

  const { t } = useTranslation();

  const openTerms = () => {
    Linking.openURL('https://danceconnect.online/terms.html');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.white }}
      behavior="height">
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.root}
        contentContainerStyle={styles.container}>
        <View>
          <Image source={images.authLogo} style={styles.logo} />
          <Text style={styles.welcome}>{title}</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur }, fieldState }) => {
              return (
                <DCInput
                  value={value}
                  onChangeText={onChange}
                  placeholder={t('email')}
                  keyboardType="email-address"
                  containerStyle={{ marginBottom: theme.spacing.MD }}
                  errorText={fieldState.error?.message}
                  onBlur={onBlur}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur }, fieldState }) => {
              return (
                <DCInput
                  value={value}
                  onChangeText={onChange}
                  placeholder={t('password')}
                  keyboardType="default"
                  secureTextEntry
                  containerStyle={{ marginBottom: theme.spacing.MD }}
                  errorText={fieldState.error?.message}
                  onBlur={onBlur}
                />
              );
            }}
          />

          <DCButton
            size="large"
            isLoading={isLoading}
            onPress={handleSubmit(onSubmit)}
            disabled={isEmptyObj(dirtyFields)}>
            {submitTitle}
          </DCButton>
          <View style={styles.linesWrapper}>
            <View style={styles.line} />
            <Text style={styles.or}>{t('or_continue')}</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.btnsWrapper}>
            {socialButtons?.map(btn => {
              if (!btn.isAvailable) {
                return null;
              }

              return (
                <DCButton
                  size="large"
                  variant="outlined"
                  key={btn.title}
                  onPress={btn.onPress}
                  isLoading={btn.isLoading}
                  containerStyle={styles.btn}>
                  <Image style={{ width: 24, height: 24 }} source={btn.icon} />
                </DCButton>
              );
            })}
          </View>
        </View>

        {footerComponent}

        <View style={{ marginTop: 'auto' }}>
          <Text style={styles.licenceText}>
            {t('terms_first')}
            <Text style={styles.licenceTextOrange} onPress={openTerms}>
              {' '}
              {t('terms_second')}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styleSheet = createStyleSheet((theming, { insets }) => ({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
    paddingHorizontal: theming.spacing.LG,
  },
  container: {
    flex: 1,
    paddingTop:
      insets.top + theming.utils.getAdaptiveWidth(theming.spacing.LG * 2),
    paddingBottom: insets.bottom + theming.spacing.MD,
  },

  logo: {
    height: 55,
    width: 200,
    alignSelf: 'center',
  },
  welcome: {
    fontSize: 32,
    textAlign: 'center',
    marginTop: theming.spacing.LG,
    marginBottom: theming.utils.getAdaptiveWidth(theming.spacing.LG * 2),
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },

  linesWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: theming.spacing.SM,
    marginVertical: theming.spacing.LG,
  },
  line: {
    height: 1,
    width: '30%',
    backgroundColor: theming.colors.gray,
  },
  or: {
    fontSize: 16,
    lineHeight: 25.2,
    fontWeight: '400',
    paddingHorizontal: 16,
    color: theming.colors.darkGray,
    fontFamily: theming.fonts.latoRegular,
  },
  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  btnsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btn: {
    width: {
      xs: 55,
      sm: 60,
    },
    height: {
      xs: 55,
      sm: 60,
    },
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
}));
