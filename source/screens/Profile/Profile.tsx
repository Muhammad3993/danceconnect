import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import * as RN from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {apiUrl} from '../../api/serverRequests';
import {useProfile} from '../../hooks/useProfile';
import useRegistration from '../../hooks/useRegistration';
import colors from '../../utils/colors';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../utils/constants';
import {defaultProfile} from '../../utils/images';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {MenuItems} from './ui/MenuItems';
import useTickets from '../../hooks/useTickets';
import {ProfileMedia} from '../../components/prodileMedia';

const ProfileScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {userImgUrl, getUser} = useProfile();
  const menuRef = useRef<Modalize>(null);

  const {getPurchasedTickets} = useTickets();
  const {currentUser} = useRegistration();

  const onPressChangeProfile = () => {
    navigation.navigate('ChangeProfile');
  };

  const onPressMenu = () => {
    menuRef.current?.open();
  };

  useEffect(() => {
    getUser();
    getPurchasedTickets();
  }, []);

  const data = Array(20).fill(1);
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ProfileMedia
        data={data}
        header={
          <>
            <RN.View style={styles.header}>
              <RN.TouchableOpacity onPress={onPressMenu}>
                <RN.Image
                  source={{uri: 'setting'}}
                  style={{width: 24, height: 24}}
                />
              </RN.TouchableOpacity>
            </RN.View>
            <RN.View style={styles.profile}>
              <FastImage
                source={{
                  uri: apiUrl + userImgUrl,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }}
                defaultSource={defaultProfile}
                style={styles.image}
              />
              <RN.View style={{maxWidth: SCREEN_WIDTH - 100}}>
                <RN.Text numberOfLines={1} style={styles.userName}>
                  {currentUser?.userName}
                </RN.Text>
                <RN.Text numberOfLines={1} style={styles.userEmail}>
                  {currentUser?.email}
                </RN.Text>
                <RN.TouchableOpacity
                  style={styles.editProfileBtn}
                  onPress={onPressChangeProfile}
                  activeOpacity={0.7}>
                  <RN.Text style={styles.editProfileText}>
                    {t('edit_profile')}
                  </RN.Text>
                </RN.TouchableOpacity>
              </RN.View>
            </RN.View>
          </>
        }
      />

      <Portal>
        <Modalize
          modalHeight={SCREEN_HEIGHT * 0.75}
          handlePosition="inside"
          handleStyle={{height: 3, width: 38}}
          ref={menuRef}>
          <MenuItems
            close={() => menuRef.current?.close()}
            navigation={navigation}
          />
        </Modalize>
      </Portal>
    </SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginHorizontal: 12,
  },

  profile: {
    flexDirection: 'row',
    paddingBottom: 24,
    alignItems: 'center',
    // marginHorizontal: 12,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    fontFamily: 'Mulish-Regular',
    paddingLeft: 20,
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 16,
    lineHeight: 22.4,
    paddingLeft: 20,
    color: 'rgba(97, 97, 97, 1)',
  },
  editProfileBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(156, 134, 220, 1)',
    borderRadius: 40,
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  editProfileText: {
    color: 'rgba(92, 51, 215, 1)',
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
});

export default ProfileScreen;
