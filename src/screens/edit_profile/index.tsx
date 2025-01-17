import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DCInput } from 'components/shared/input';
import { DCButton } from 'components/shared/button';
// dropdown
import { FillArrowIcon } from 'components/icons/fillArrow';
import { genders } from 'common/constants';
import { useDCStore } from 'store';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import { useEditUser } from 'data/hooks/user';
import { PhotoUplaod } from './ui/photo_uplaod';
import { StackScreenProps } from 'screens/interfaces';
import { showErrorToast } from 'common/libs/toast';
import { User } from 'data/api/user/inerfaces';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function EditProfileScreen({
  navigation,
}: StackScreenProps<'editProfile'>) {
  const user = useDCStore.use.user();
  const setUser = useDCStore.use.setUser();
  const { t } = useTranslation();
  const { styles } = useStyles(styleSheet);

  const { control, handleSubmit } = useForm({
    defaultValues: user ?? {},
  });

  const { mutate, isPending } = useEditUser();

  const handleUpdateUser = (newData: Partial<User>) => {
    mutate(newData, {
      onSuccess(data) {
        setUser(data);
        navigation.pop();
      },
      onError(err) {
        const error = err as Error;
        showErrorToast(error.message);
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.editProfile}>
        <View style={styles.editForm}>
          <Controller
            control={control}
            name="userImage"
            render={({ field: { value, onChange } }) => (
              <PhotoUplaod value={value} onChange={onChange} />
            )}
          />

          <Controller
            control={control}
            name="fullName"
            render={({ field: { value, onChange } }) => (
              <DCInput
                placeholder={t('name')}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="userGender"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                value={value}
                data={genders.map(el => ({
                  label: el.title,
                  value: el.id,
                }))}
                onChange={data => onChange(data.value)}
                placeholder={t('gender')}
                labelField="label"
                valueField="value"
                style={styles.dropdown}
                renderRightIcon={() => <FillArrowIcon />}
              />
            )}
          />

          <Controller
            control={control}
            name="about"
            render={({ field: { value, onChange } }) => (
              <DCInput
                placeholder={t('yourself')}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <DCButton
          isLoading={isPending}
          onPress={handleSubmit(handleUpdateUser)}
          textStyle={{ fontWeight: '700' }}>
          {t('save_changes')}
        </DCButton>
      </View>
    </SafeAreaView>
  );
}

const styleSheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.LG,
    backgroundColor: theme.colors.white,
  },
  editProfile: {
    flex: 1,
    justifyContent: 'space-between',
  },
  editTop: {
    alignItems: 'center',
  },
  editBack: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  backTitle: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontFamily: theme.fonts.latoRegular,
  },

  editForm: {
    width: '100%',
    gap: theme.spacing.MD,
    alignItems: 'center',
  },
  dropdown: {
    width: '100%',
    height: 56,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.MD,
    borderWidth: 1,
    borderColor: theme.colors.gray50,
  },
  dropDownContainer: {
    backgroundColor: theme.colors.lightGray,
    borderWidth: 1,
    borderColor: theme.colors.gray50,
  },
}));
