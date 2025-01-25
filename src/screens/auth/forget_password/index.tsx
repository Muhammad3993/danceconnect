import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from 'screens/interfaces';
import { DCInput } from 'components/shared/input';
import { useTranslation } from 'react-i18next';
import { DCButton } from 'components/shared/button';
import { useForgetPassword } from 'data/hooks/user';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { isEmptyObj } from 'common/utils/object';

export function ForgetPaswordPage({
  navigation,
}: StackScreenProps<'forgetPassword'>) {
  const [smsIsSend, setSmsIsSend] = useState(false);
  const { t } = useTranslation();

  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(
      yup.object({
        email: yup.string().email().required(t('emailRequired')),
      }),
    ),
  });
  const { styles, theme } = useStyles(stylesheet);
  const { dirtyFields, isValid, isSubmitting } = formState;
  const { mutateAsync } = useForgetPassword();

  const handleLogin = async ({ email }: { email: string }) => {
    await mutateAsync(email);
    setSmsIsSend(true);
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, paddingBottom: theme.spacing.LG }}>
        {smsIsSend ? (
          <View style={styles.info}>
            <Text style={styles.infoText}>{t('openRecoverLink')}</Text>
          </View>
        ) : (
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur }, fieldState }) => {
              return (
                <DCInput
                  autoCorrect={false}
                  autoCapitalize="none"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  placeholder={t('email')}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="done"
                  rootStyle={{
                    marginBottom: theme.utils.getAdaptiveHeight(theme.space.lg),
                  }}
                  errorText={fieldState.error?.message}
                  onBlur={onBlur}
                />
              );
            }}
          />
        )}

        <DCButton
          size="large"
          isLoading={isSubmitting}
          containerStyle={{ marginTop: 'auto', marginBottom: theme.spacing.LG }}
          onPress={() => {
            if (smsIsSend) {
              navigation.pop();
            } else {
              handleSubmit(handleLogin)();
            }
          }}
          disabled={isEmptyObj(dirtyFields) || !isValid}>
          {t(smsIsSend ? 'backToSignIn' : 'send')}
        </DCButton>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet(theming => ({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
    paddingHorizontal: theming.spacing.LG,
  },

  scroll: {
    flex: 1,
  },

  info: {
    alignItems: 'center',
  },

  infoImg: {
    width: 44,
    height: 44,
    marginBottom: theming.spacing.SM,
  },
  infoText: {
    color: theming.colors.gray300,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
  },
}));
