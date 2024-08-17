import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DCInput } from 'components/shared/input';
import { DCButton } from 'components/shared/button';
import { theming } from 'common/constants/theming';
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

export function EditProfileScreen({
  navigation,
}: StackScreenProps<'editProfile'>) {
  const user = useDCStore.use.user();
  const setUser = useDCStore.use.setUser();
  const { t } = useTranslation();
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
            name="userName"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theming.spacing.LG,
    backgroundColor: theming.colors.white,
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
    color: theming.colors.textPrimary,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
  },

  editForm: {
    width: '100%',
    gap: theming.spacing.MD,
    alignItems: 'center',
  },
  dropdown: {
    width: '100%',
    height: 56,
    backgroundColor: theming.colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: theming.spacing.MD,
    borderWidth: 1,
    borderColor: theming.colors.gray50,
  },
  dropDownContainer: {
    backgroundColor: theming.colors.lightGray,
    borderWidth: 1,
    borderColor: theming.colors.gray50,
  },
});
