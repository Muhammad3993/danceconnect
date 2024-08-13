import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DCInput } from 'components/shared/input';
import { DCButton } from 'components/shared/button';
import { theming } from 'common/constants/theming';
import { EditIcon } from 'components/icons/edit';
import { MailIcon } from 'components/icons/mail';
// dropdown
import { FillArrowIcon } from 'components/icons/fillArrow';
import { genders } from 'common/constants';
import { useDCStore } from 'store';
import { useTranslation } from 'react-i18next';
import { UserImage } from 'components/user_image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';

export function EditProfileScreen() {
  const user = useDCStore.use.user();
  const { t } = useTranslation();
  const { control } = useForm({
    defaultValues: user ?? {},
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.editProfile}>
        <View style={styles.editTop}>
          <View style={styles.editAvatar}>
            <UserImage style={styles.editImage} />
            <EditIcon style={styles.editIcon} />
          </View>

          <View style={styles.editForm}>
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
                  onChange={data => onChange(data)}
                  placeholder={t('gender')}
                  labelField="label"
                  valueField="value"
                  style={styles.dropdown}
                  renderRightIcon={() => <FillArrowIcon />}
                />
              )}
            />

            <DCInput
              value="andrew_ainsley@yourdomain.com"
              rightIcon={<MailIcon style={{ margin: 'auto' }} />}
            />
          </View>
        </View>

        <DCButton textStyle={{ fontWeight: '700' }}>
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
  editAvatar: {
    width: 140,
    height: 140,
    position: 'relative',
    marginVertical: theming.spacing.LG,
  },

  editImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    borderRadius: 70,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  editForm: {
    width: '100%',
    gap: theming.spacing.MD,
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
