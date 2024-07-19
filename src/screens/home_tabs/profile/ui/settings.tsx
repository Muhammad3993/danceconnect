import { Linking, StyleSheet } from 'react-native';
import { TouchableOpacity, View, Text } from 'react-native';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationProp } from '@react-navigation/native';
import { theming } from 'common/constants/theming';

interface Props {
  navigation: NavigationProp<any>;
  close: () => void;
}

export function ProfileSettings({ navigation, close }: Props) {
  const { t } = useTranslation();

  const onPressCommunities = () => {
    close();
  };

  const onPressEvents = () => {
    close();
  };

  const onPressDanceStyles = () => {
    close();
  };

  const onPressTickets = () => {
    close();
  };

  const onPressDeleteAccount = () => {};

  const handleLogout = () => {
    close();
  };

  const onPressChangePassword = () => {};

  const onPressChangeLG = () => {
    close();
  };
  return (
    <View style={styles.listWrapper}>
      <TouchableOpacity
        style={styles.listItemWrapper}
        onPress={onPressCommunities}>
        <Text style={styles.listItemText}>
          {t('manage_communties')}
          {1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.listItemWrapper} onPress={onPressEvents}>
        <Text style={styles.listItemText}>
          {t('manage_events')}
          {1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.listItemWrapper}
        onPress={onPressDanceStyles}>
        <Text style={styles.listItemText}>
          {t('manage_dc')}
          {1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.listItemWrapper} onPress={onPressTickets}>
        <Text style={styles.listItemText}>
          {t('my_tickets')}
          {1}
        </Text>
      </TouchableOpacity>
      {/* <View style={styles.line} /> */}
      {/* {isSocialAuth && <View style={{ marginTop: -12 }} />}
      <LocationSelector isProfileScreen />
      {isSocialAuth && <View style={{ marginTop: -12 }} />} */}
      {/* {!isSocialAuth && (
        <TouchableOpacity
          style={styles.listItemWrapper}
          onPress={() => changePassRefModalize?.current?.open('top')}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={{ uri: 'shield' }} style={styles.icon} />
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.listItemText}>{t('change_pass')}</Text>
            </View>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Image source={{ uri: 'arrowright' }} style={styles.iconRight} />
          </View>
        </TouchableOpacity>
      )} */}
      {/* {isChangeLanguage && (
        <>
          {<View style={{ marginTop: 10 }} />}
          <TouchableOpacity
            style={styles.listItemWrapper}
            onPress={onPressChangeLG}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: 'lg' }} style={styles.icon} />
              <View style={{ justifyContent: 'center' }}>
                <Text style={styles.listItemText}>{t('select_language')}</Text>
              </View>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Image source={{ uri: 'arrowright' }} style={styles.iconRight} />
            </View>
          </TouchableOpacity>
          {isSocialAuth && <View style={{ marginTop: -12 }} />}
        </>
      )} */}
      {/* <View style={styles.line} /> */}
      <TouchableOpacity
        style={styles.listItemWrapper}
        onPress={() => {
          Linking.openURL('https://danceconnect.online/terms.html');
        }}>
        <Text style={styles.listItemText}>{t('terms_condition')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.listItemWrapper}
        onPress={() => {
          Linking.openURL('https://danceconnect.online/privacy.html');
        }}>
        <Text style={styles.listItemText}>{t('privacy')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.listItemWrapper}
        onPress={() => {
          Linking.openURL('https://danceconnect.online/payouts.html');
        }}>
        <Text style={styles.listItemText}>{t('payouts')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.listItemWrapper}
        onPress={() => {
          Linking.openURL('mailto:dance.connect@incode-systems.com');
        }}>
        <Text style={styles.listItemText}>{t('contact')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.listItemWrapper} onPress={() => {}}>
        <Text style={styles.listItemTextLogout}>{t('logout')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.listItemWrapper} onPress={() => {}}>
        <Text style={styles.listItemTextLogout}>{t('del_acc')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  listWrapper: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  listItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  listItemText: {
    lineHeight: 25.2,
    paddingLeft: 20,
    color: theming.colors.textPrimary,
    fontWeight: '500',
  },
  listItemTextLogout: {
    fontSize: 18,
    lineHeight: 25.2,
    paddingLeft: 20,
    color: theming.colors.redError,
  },
  locationText: {
    fontSize: 16,
    lineHeight: 22.4,
    paddingRight: 20,
    color: theming.colors.darkGray,
  },
});
