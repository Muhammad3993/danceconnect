import React from 'react';

import { CredentialsForm } from '../ui/CredentialsForm';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { localStorage } from 'common/libs/local_storage';
import { useLoginUser } from 'data/hooks/user';
import { StackScreenProps } from 'screens/interfaces';
import { useDCStore } from 'store';
import { theming } from 'common/constants/theming';
import { showErrorToast } from 'common/libs/toast';

export function LoginScreen({ navigation }: StackScreenProps<'login'>) {
  const { mutate, isLoading } = useLoginUser();
  const getUser = useDCStore.use.initAppAction();

  const { t } = useTranslation();

  const handleLogin = (email: string, password: string) => {
    mutate(
      { email, password },
      {
        async onSuccess(data) {
          await localStorage.setItem('token', data.access_token);
          getUser();
        },
        onError(err) {
          const error = err as Error;
          showErrorToast(error.message);
        },
      },
    );
  };

  return (
    <CredentialsForm
      onSubmit={handleLogin}
      isLoading={isLoading}
      submitTitle={t('login')}
      footerComponent={
        <View style={styles.bottomWrapper}>
          <Text style={styles.alreadyAccountText}>{t('dont_account')}</Text>
          <TouchableOpacity onPress={() => navigation.replace('register')}>
            <Text style={styles.logInText}>{t('sign_up')}</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
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
    color: theming.colors.darkGray,
    fontFamily: theming.fonts.latoRegular,
  },
  logInText: {
    paddingLeft: 8,
    color: theming.colors.orange,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: theming.fonts.latoRegular,
  },
});
