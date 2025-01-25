import { yupResolver } from '@hookform/resolvers/yup';
import { isEmptyObj } from 'common/utils/object';
import { DCButton } from 'components/shared/button';
import { useResetPassword } from 'data/hooks/user';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { StackScreenProps } from 'screens/interfaces';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import { DCInput } from 'components/shared/input';

const scheme = yup.object({
  newPassword: yup
    .string()
    .min(6, i18n.t('minimumPassword'))
    .required(i18n.t('passwordRequired')),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], i18n.t('passwordMatch')),
});

export function CreatePaswordScreen({
  navigation,
  route,
}: StackScreenProps<'createPassword'>) {
  const { t } = useTranslation();
  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(scheme),
    mode: 'onChange',
  });

  const { styles, theme } = useStyles(stylesheet);
  const { dirtyFields, isValid, isSubmitting } = formState;
  const { mutateAsync } = useResetPassword();

  const handleReset = async ({ newPassword }: yup.InferType<typeof scheme>) => {
    await mutateAsync({ password: newPassword, hash: route.params.hash ?? '' });
    navigation.popTo('auth');
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, paddingBottom: theme.spacing.LG }}>
        <Controller
          control={control}
          name="newPassword"
          render={({ field: { value, onChange, onBlur }, fieldState }) => {
            return (
              <DCInput
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                placeholder={t('newPassword')}
                textContentType="password"
                keyboardType="default"
                containerStyle={{
                  marginBottom: theme.utils.getAdaptiveHeight(theme.spacing.LG),
                }}
                errorText={fieldState.error?.message}
                onBlur={onBlur}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="repeatPassword"
          render={({ field: { value, onChange, onBlur }, fieldState }) => {
            return (
              <DCInput
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                placeholder={t('repeatPassword')}
                textContentType="password"
                keyboardType="default"
                containerStyle={{
                  marginBottom: theme.utils.getAdaptiveHeight(theme.spacing.LG),
                }}
                errorText={fieldState.error?.message}
                onBlur={onBlur}
              />
            );
          }}
        />

        <DCButton
          size="large"
          isLoading={isSubmitting}
          containerStyle={{ marginTop: 'auto', marginBottom: theme.spacing.LG }}
          onPress={handleSubmit(handleReset)}
          disabled={isEmptyObj(dirtyFields) || !isValid}>
          {t('createNewPassword')}
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
