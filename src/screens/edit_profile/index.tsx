import React, { useState } from 'react';
// import react-native
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import component
import { DCInput } from 'components/shared/input';
import { DCButton } from 'components/shared/button';
// import theming
import { theming } from 'common/constants/theming';
// import images
// import icons
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import { EditIcon } from 'components/icons/edit';
import { MailIcon } from 'components/icons/mail';
// dropdown
import DropDownPicker from 'react-native-dropdown-picker';
import { FillArrowIcon } from 'components/icons/fillArrow';
import { genders } from 'common/constants';
import { useDCStore } from 'store';
import { useTranslation } from 'react-i18next';
import { UserImage } from 'components/user_image';

export function EditProfileScreen() {
  const user = useDCStore.use.user();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.editProfile}>
        <View style={styles.editTop}>
          <View style={styles.editBack}>
            <ArrowLeftIcon fill={theming.colors.textPrimary} />
            <Text style={styles.backTitle}>Edit profile</Text>
          </View>

          <View style={styles.editAvatar}>
            <UserImage style={styles.editImage} />
            <EditIcon style={styles.editIcon} />
          </View>

          <View style={styles.editForm}>
            <DCInput
              inputStyle={{
                backgroundColor: theming.colors.lightGray,
              }}
              value="Andrew Ainsley"
            />
            <DropDownPicker
              open={open}
              value={user?.userGender ?? 'male'}
              items={genders.map(el => ({ label: el.title, value: el.title }))}
              setOpen={setOpen}
              setValue={() => {}}
              placeholder="Gender"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropDownContainer}
              showArrowIcon={true}
              showTickIcon={false}
              modalContentContainerStyle={{
                borderWidth: 1,
                borderColor: theming.colors.gray,
              }}
              textStyle={{
                textTransform: 'capitalize',
                fontSize: 16,
              }}
              ArrowDownIconComponent={() => <FillArrowIcon />}
              ArrowUpIconComponent={() => (
                <FillArrowIcon style={{ transform: [{ rotate: '180deg' }] }} />
              )}
            />
            <DCInput
              inputStyle={{
                backgroundColor: theming.colors.lightGray,
              }}
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
    paddingVertical: theming.spacing.LG,
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
