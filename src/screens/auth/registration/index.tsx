import React from 'react';

import { useRegisterUser } from '@data/hooks/user';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { StackScreenProps } from '@screens/interfaces';
import { CredentialsForm } from '../ui/CredentialsForm';

export function RegisterScreen({ navigation }: StackScreenProps<'register'>) {
  const { mutate, isPending } = useRegisterUser();
  const { t } = useTranslation();
  const { styles } = useStyles(styleSheet);

  return (
    <CredentialsForm
      isLoading={isPending}
      submitTitle={t('sign_up')}
      onSubmit={mutate}
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

const styleSheet = createStyleSheet(theming => ({
  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: theming.spacing.LG,
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
