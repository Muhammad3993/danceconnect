import { Linking, StyleSheet } from 'react-native';
import { View } from 'react-native';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationProp } from '@react-navigation/native';
import { theming } from 'common/constants/theming';
import { ListItem } from 'components/list_item';
import { CommunitiesIcon } from 'components/icons/communities';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { CategoryIcon } from 'components/icons/category';
import { TicketIcon } from 'components/icons/ticket';
import { DCLine } from 'components/shared/line';
import { LocationIcon } from 'components/icons/location';
import { SecurityIcon } from 'components/icons/security';
import { NotificationIcon } from 'components/icons/notification';
import { PaymentIcon } from 'components/icons/payment';
import { SwapIcon } from 'components/icons/swap';
import { InfoIcon } from 'components/icons/info';
import { StarIcon } from 'components/icons/star';
import { LogoutIcon } from 'components/icons/logout';
import { TrashIcon } from 'components/icons/trash';
import { useDCStore } from 'store';

interface Props {
  navigation: NavigationProp<any>;
  close: () => void;
}

export function ProfileSettings({ navigation, close }: Props) {
  const { t } = useTranslation();
  const logOutAction = useDCStore.use.clearDCStoreAction();

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

  const handleLogout = async () => {
    await logOutAction();
    close();
  };

  const onPressChangePassword = () => {};

  const onPressChangeLG = () => {
    close();
  };
  return (
    <View style={styles.listWrapper}>
      <ListItem
        leftIcon={
          <CommunitiesIcon
            fill={theming.colors.textPrimary}
            width={28}
            height={28}
          />
        }
        click={onPressCommunities}
        title={t('manage_communties')}
        count={'(1)'}
        rightIcon={
          <RightArrowIcon
            stroke={theming.colors.textPrimary}
            width={20}
            height={20}
          />
        }
      />

      <ListItem
        leftIcon={<CategoryIcon />}
        click={onPressDanceStyles}
        title={t('manage_dc')}
        count={'(3)'}
        rightIcon={
          <RightArrowIcon
            stroke={theming.colors.textPrimary}
            width={20}
            height={20}
          />
        }
      />

      <ListItem
        leftIcon={
          <TicketIcon
            fill={theming.colors.textPrimary}
            width={28}
            height={28}
          />
        }
        click={onPressTickets}
        title={t('my_tickets')}
        count={'(3)'}
        rightIcon={
          <RightArrowIcon
            stroke={theming.colors.textPrimary}
            width={20}
            height={20}
          />
        }
      />

      <DCLine />

      <ListItem
        leftIcon={<LocationIcon active />}
        click={onPressTickets}
        title={t('location')}
        location={'San Francisco, California'}
        rightIcon={
          <RightArrowIcon
            stroke={theming.colors.textPrimary}
            width={20}
            height={20}
          />
        }
      />

      <ListItem
        leftIcon={<SecurityIcon />}
        click={onPressTickets}
        title={t('Security')}
        rightIcon={
          <RightArrowIcon
            stroke={theming.colors.textPrimary}
            width={20}
            height={20}
          />
        }
      />

      <ListItem
        leftIcon={<NotificationIcon />}
        click={onPressTickets}
        title={t('Notification')}
        rightIcon={
          <RightArrowIcon
            stroke={theming.colors.textPrimary}
            width={20}
            height={20}
          />
        }
      />

      <ListItem
        leftIcon={<PaymentIcon />}
        click={onPressTickets}
        title={t('Payments')}
        rightIcon={
          <RightArrowIcon
            stroke={theming.colors.textPrimary}
            width={20}
            height={20}
          />
        }
      />

      <ListItem
        leftIcon={<SwapIcon />}
        click={onPressTickets}
        title={t('Linked Accounts')}
        rightIcon={
          <RightArrowIcon
            stroke={theming.colors.textPrimary}
            width={20}
            height={20}
          />
        }
      />

      <ListItem
        leftIcon={<InfoIcon />}
        click={onPressTickets}
        title={t('Help Center')}
        rightIcon={
          <RightArrowIcon
            stroke={theming.colors.textPrimary}
            width={20}
            height={20}
          />
        }
      />

      <DCLine />

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

      <ListItem
        leftIcon={<StarIcon />}
        click={onPressTickets}
        title={t('Rate us')}
        rightIcon={
          <RightArrowIcon
            stroke={theming.colors.textPrimary}
            width={20}
            height={20}
          />
        }
      />

      <ListItem
        leftIcon={<InfoIcon />}
        click={() => {
          Linking.openURL('https://danceconnect.online/terms.html');
        }}
        title={t('Terms & Privacy')}
        rightIcon={
          <RightArrowIcon
            stroke={theming.colors.textPrimary}
            width={20}
            height={20}
          />
        }
      />

      <ListItem
        click={handleLogout}
        leftIcon={<LogoutIcon />}
        title={t('Logout')}
        titleStyle={{
          color: theming.colors.redError,
        }}
      />

      <ListItem
        leftIcon={<TrashIcon />}
        title={t('del_acc')}
        titleStyle={{
          color: theming.colors.redError,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listWrapper: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 15,
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
});
