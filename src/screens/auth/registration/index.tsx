import React from 'react';

import { CredentialsForm } from '../ui/CredentialsForm';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { localStorage } from 'common/libs/local_storage';
import { useRegisterUser } from 'data/hooks/user';
import { StackScreenProps } from 'screens/interfaces';
import { useDCStore } from 'store';
import { theming } from 'common/constants/theming';
import { showErrorToast } from 'common/libs/toast';
import { AuthSchema } from 'data/api/user/schema';

export function RegisterScreen({ navigation }: StackScreenProps<'register'>) {
  const { mutate, isPending } = useRegisterUser();
  const getUser = useDCStore.use.initAppAction();
  const { t } = useTranslation();

  const handleLogin = (d: AuthSchema) => {
    mutate(d, {
      async onSuccess(data) {
        await localStorage.setItem('token', data.access_token);
        getUser();
      },
      onError(err) {
        const error = err as Error;
        showErrorToast(error.message);
      },
    });
  };

  return (
    <CredentialsForm
      isLoading={isPending}
      submitTitle={t('sign_up')}
      onSubmit={handleLogin}
      title={t('create_account')}
      footerComponent={
        <View style={styles.bottomWrapper}>
          <Text style={styles.alreadyAccountText}>{t('already')}</Text>
          <TouchableOpacity onPress={() => navigation.replace('login')}>
            <Text style={styles.logInText}>{t('login')}</Text>
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
