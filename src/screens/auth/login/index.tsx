import React from 'react';

import { CredentialsForm } from '../ui/CredentialsForm';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLoginUser } from 'data/hooks/user';
import { StackScreenProps } from 'screens/interfaces';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function LoginScreen({ navigation }: StackScreenProps<'login'>) {
  const { mutate, isPending } = useLoginUser();
  const { styles } = useStyles(styleSheet);

  const { t } = useTranslation();

  return (
    <CredentialsForm
      onSubmit={mutate}
      isLoading={isPending}
      submitTitle={t('login')}
      title={t('login')}
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

const styleSheet = createStyleSheet(theming => ({
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
}));
