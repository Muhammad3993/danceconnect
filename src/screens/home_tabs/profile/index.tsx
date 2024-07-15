import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useDCStore } from 'store';
import { theming } from 'common/constants/theming';
import { UserImage } from 'components/user_image';
import { useTranslation } from 'react-i18next';
import { TabScreenProps } from 'screens/interfaces';

export function ProfileScreen({ navigation }: TabScreenProps<'profile'>) {
  const user = useDCStore.use.user();
  const logOut = useDCStore.use.clearDCStoreAction();
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <View>
        <View style={styles.profileView}>
          <UserImage style={styles.img} />
          <View>
            <Text style={styles.name}>{user?.userName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
        <Text onPress={() => navigation.push('editProfile')}>Edit Profile</Text>
      </View>

      <Text onPress={logOut} style={{ color: theming.colors.redError }}>
        {t('logout')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: theming.spacing.LG,
    backgroundColor: theming.colors.white,
    justifyContent: 'space-between',
  },
  profileView: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
  },
  img: { width: 60, height: 60, borderRadius: 50 },
  name: {
    color: theming.colors.textPrimary,
    fontSize: 20,
    fontFamily: theming.fonts.latoRegular,
    fontWeight: '700',
    marginBottom: theming.spacing.SM,
  },
  email: {
    color: theming.colors.textSecondary,
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
  },
});
