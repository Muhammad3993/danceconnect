import {
  Image,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { DCInput } from 'components/shared/input';
import { DCButton } from 'components/shared/button';
import { theming } from 'common/constants/theming';
import { useSocialBtns } from 'data/hooks/user';
import { images } from 'common/resources/images';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthSchema, authSchema } from './schema';
import { isEmptyObj } from 'common/utils/object';

interface Props {
  footerComponent: ReactNode;
  submitTitle: string;
  isLoading: boolean;
  onSubmit: (email: string, password: string) => void;
}

export function CredentialsForm({
  footerComponent,
  submitTitle,
  isLoading,
  onSubmit,
}: Props) {
  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(authSchema),
  });
  const { dirtyFields } = formState;
  const { socialButtons } = useSocialBtns();

  const { t } = useTranslation();

  const openTerms = () => {
    Linking.openURL('https://danceconnect.online/terms.html');
  };
  const onPressSubmit = ({ email, password }: AuthSchema) => {
    onSubmit(email, password);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View>
          <Image source={images.authLogo} style={styles.logo} />
          <Text style={styles.welcome}>{t('create_account')}</Text>

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
                  containerStyle={{ marginBottom: theming.spacing.MD }}
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
                  containerStyle={{ marginBottom: theming.spacing.MD }}
                  errorText={fieldState.error?.message}
                  onBlur={onBlur}
                />
              );
            }}
          />

          <DCButton
            size="large"
            isLoading={isLoading}
            onPress={handleSubmit(onPressSubmit)}
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
                  containerStyle={{ paddingHorizontal: theming.spacing.LG }}>
                  <Image style={{ width: 24, height: 24 }} source={btn.icon} />
                </DCButton>
              );
            })}
          </View>
        </View>

        {footerComponent}

        <View style={{ paddingHorizontal: 20 }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theming.colors.white,
    padding: theming.spacing.LG,
    justifyContent: 'space-between',
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
    color: theming.colors.redError,
    fontSize: 13,
  },

  welcome: {
    fontSize: 32,
    textAlign: 'center',
    paddingTop: 41,
    paddingBottom: 36,
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
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
    paddingTop: 60,
    paddingBottom: 40,
  },

  btnsWrapper: {
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 30,
  },
  licenceText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: theming.colors.darkGray,
    fontFamily: theming.fonts.latoRegular,
    textAlign: 'center',
    marginHorizontal: 40,
  },
  licenceTextOrange: {
    color: theming.colors.orange,
    fontSize: 14,
    lineHeight: 20,
  },
});
