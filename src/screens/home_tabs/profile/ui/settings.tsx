import { Linking, StyleSheet, Text, View } from 'react-native';

import { theming } from 'common/constants/theming';
import { CategoryIcon } from 'components/icons/category';
import { CommunitiesIcon } from 'components/icons/communities';
import { InfoIcon } from 'components/icons/info';
import { LocationIcon } from 'components/icons/location';
import { LogoutIcon } from 'components/icons/logout';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { TicketIcon } from 'components/icons/ticket';
import { TrashIcon } from 'components/icons/trash';
import { ListItem } from 'components/list_item';
import { DCLine } from 'components/shared/line';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { TabScreenNavigation } from 'screens/interfaces';
import { useDCStore } from 'store';
import { DeleteModal } from './DeleteModal';
import LocationSelector from 'components/location_selector';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useEditUser } from 'data/hooks/user';
import { UserLocation } from 'data/api/user/inerfaces';
import { showErrorToast } from 'common/libs/toast';

interface Props {
  navigation: TabScreenNavigation<'profile'>;
  close: () => void;
}

export function ProfileSettings({ navigation, close }: Props) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const locationRef = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();
  const logOutAction = useDCStore.use.clearDCStoreAction();
  const { mutate } = useEditUser();
  const user = useDCStore.use.user();
  const setUser = useDCStore.use.setUser();

  const changeLocation = (location: UserLocation) => {
    mutate(
      { location },
      {
        onSuccess(data) {
          setUser(data);
          locationRef.current?.dismiss();
        },
        onError(err) {
          const error = err as Error;
          showErrorToast(error.message);
        },
      },
    );
  };

  const onPressCommunities = () => {
    close();
  };

  const onPressDanceStyles = () => {
    close();
    navigation.push('editDanceStyles');
  };

  const onPressTickets = () => {};

  const onPressDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const handleLogout = async () => {
    await logOutAction();
    close();
  };

  return (
    <>
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
          title={t('manage_events')}
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
          count={`(${user?.individualStyles.length})`}
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
          // count={'(3)'}
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
          click={() => {
            locationRef.current?.present();
          }}
          title={t('location')}
          rightIcon={
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.listItemLocation}>
                {user?.location?.location}
              </Text>
              <RightArrowIcon
                stroke={theming.colors.textPrimary}
                width={20}
                height={20}
              />
            </View>
          }
        />

        <DCLine />

        <ListItem
          leftIcon={<InfoIcon />}
          click={() => {
            Linking.openURL('https://danceconnect.online/terms.html');
          }}
          title={t('terms_condition')}
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
            Linking.openURL('https://danceconnect.online/privacy.html');
          }}
          title={t('privacy')}
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
            Linking.openURL('https://danceconnect.online/payouts.html');
          }}
          title={t('payouts')}
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
            Linking.openURL('mailto:dance.connect@incode-systems.com');
          }}
          title={t('contact')}
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
          title={t('logout')}
          titleStyle={{ color: theming.colors.error }}
        />

        <ListItem
          leftIcon={<TrashIcon />}
          title={t('del_acc')}
          titleStyle={{ color: theming.colors.error }}
          click={onPressDeleteAccount}
        />
      </View>
      <Modal
        onBackdropPress={() => setDeleteModalVisible(false)}
        isVisible={deleteModalVisible}>
        <DeleteModal onChange={setDeleteModalVisible} />
      </Modal>
      <LocationSelector ref={locationRef} onChange={changeLocation} />
    </>
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
  listItemLocation: {
    fontSize: 14,
    color: theming.colors.gray700,
    fontWeight: '400',
    fontFamily: theming.fonts.latoRegular,
  },
});
