import {StyleSheet} from 'react-native';
import * as RN from 'react-native';

import React, {useEffect, useRef, useState} from 'react';
import colors from '../../../utils/colors';
import {useTranslation} from 'react-i18next';
import {NavigationProp} from '@react-navigation/native';
import {useCommunities} from '../../../hooks/useCommunitites';
import useEvents from '../../../hooks/useEvents';
import useRegistration from '../../../hooks/useRegistration';
import useTickets from '../../../hooks/useTickets';
import {useProfile} from '../../../hooks/useProfile';
import LocationSelector from '../../../components/locationSelector';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../utils/constants';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {Input} from '../../../components/input';
import {Button} from '../../../components/Button';
import {deleteUser} from '../../../api/serverRequests';
import {removeAccount} from '../../../api/authSocial';
import {useDispatch} from 'react-redux';
import {logoutSuccess} from '../../../store/actions/authorizationActions';
import {choosedCityAction} from '../../../store/actions/appStateActions';
import useAppStateHook from '../../../hooks/useAppState';

interface Props {
  navigation: NavigationProp<any>;
  close: () => void;
}

export function MenuItems({navigation, close}: Props) {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const {managingCommunity} = useCommunities();
  const {managingEventsAndPassed} = useEvents();
  const {currentUser, logout, userUid} = useRegistration();
  const {purchasedTickets} = useTickets();
  const {
    isSocialAuth,
    errorsWithChangePassword,
    onChangePassword,
    isSuccessChangePassword,
  } = useProfile();
  const {isChangeLanguage} = useAppStateHook();

  const logoutRefModalize = useRef<Modalize>(null);
  const changePassRefModalize = useRef<Modalize>(null);
  const successChangePassRefModalize = useRef<Modalize>(null);
  const deleteAccountModazile = useRef<Modalize>(null);

  const [newPassword, setNewPassword] = useState('');
  const [visibleError, setVisibleError] = useState(false);

  const onPressCommunities = () => {
    close();
    navigation.navigate('ManagingCommunities');
  };

  const onPressEvents = () => {
    close();
    navigation.navigate('ManagingEvents');
  };

  const onPressDanceStyles = () => {
    close();
    navigation.push('ProfileDanceStyles');
  };

  const onPressTickets = () => {
    close();
    navigation.navigate('Tickets');
  };

  const onPressDeleteAccount = () => {
    deleteAccountModazile.current?.close();
    close();
    deleteUser(userUid);
    removeAccount();
    dispatch(logoutSuccess());
    dispatch(choosedCityAction({currentCity: ''}));
  };

  const handleLogout = () => {
    logoutRefModalize.current?.close();

    close();
    logout();
  };

  const onPressChangePassword = () => {
    onChangePassword(newPassword);
  };

  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    if (errorsWithChangePassword) {
      setVisibleError(true);
    }
    const timer = setTimeout(() => {
      setVisibleError(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [errorsWithChangePassword]);

  useEffect(() => {
    if (isSuccessChangePassword) {
      changePassRefModalize?.current?.close();
      successChangePassRefModalize?.current?.open();
      // RN.Alert.alert('Please, log in again');
    }
  }, [isSuccessChangePassword]);

  const countTickets = purchasedTickets?.length ?? 0;

  const onPressChangeLG = () => {
    close();
    navigation.navigate('LANGUAGE');
  };
  return (
    <>
      <RN.View style={styles.listWrapper}>
        <RN.TouchableOpacity
          style={styles.listItemWrapper}
          onPress={onPressCommunities}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image source={{uri: 'comoutline'}} style={styles.icon} />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.listItemText}>
                {t('manage_communties')}
                {managingCommunity?.length > 0 && (
                  <RN.Text
                    style={{
                      color: colors.darkGray,
                      fontWeight: '400',
                      fontSize: 16,
                    }}>{` (${managingCommunity?.length})`}</RN.Text>
                )}
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image source={{uri: 'arrowright'}} style={styles.iconRight} />
          </RN.View>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          style={styles.listItemWrapper}
          onPress={onPressEvents}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image source={{uri: 'group'}} style={styles.icon} />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.listItemText}>
                {t('manage_events')}
                {managingEventsAndPassed?.length > 0 && (
                  <RN.Text
                    style={{
                      color: colors.darkGray,
                      fontWeight: '400',
                      fontSize: 16,
                    }}>{` (${managingEventsAndPassed?.length})`}</RN.Text>
                )}
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image source={{uri: 'arrowright'}} style={styles.iconRight} />
          </RN.View>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          style={styles.listItemWrapper}
          onPress={onPressDanceStyles}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image source={{uri: 'dancestyles'}} style={styles.icon} />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.listItemText}>
                {t('manage_dc')}
                {currentUser?.individualStyles?.length > 0 && (
                  <RN.Text
                    style={{
                      color: colors.darkGray,
                      fontWeight: '400',
                      fontSize: 16,
                    }}>{` (${currentUser?.individualStyles?.length})`}</RN.Text>
                )}
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image source={{uri: 'arrowright'}} style={styles.iconRight} />
          </RN.View>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          style={styles.listItemWrapper}
          onPress={onPressTickets}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image source={{uri: 'ticketoutline'}} style={styles.icon} />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.listItemText}>
                {t('my_tickets')}
                {countTickets !== 0 && (
                  <RN.Text
                    style={{
                      color: colors.darkGray,
                      fontWeight: '400',
                      fontSize: 16,
                    }}>{` (${countTickets})`}</RN.Text>
                )}
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image source={{uri: 'arrowright'}} style={styles.iconRight} />
          </RN.View>
        </RN.TouchableOpacity>
        <RN.View style={styles.line} />
        {isSocialAuth && <RN.View style={{marginTop: -12}} />}
        <LocationSelector isProfileScreen />
        {isSocialAuth && <RN.View style={{marginTop: -12}} />}
        {!isSocialAuth && (
          <RN.TouchableOpacity
            style={styles.listItemWrapper}
            onPress={() => changePassRefModalize?.current?.open()}>
            <RN.View style={{flexDirection: 'row'}}>
              <RN.Image source={{uri: 'shield'}} style={styles.icon} />
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.listItemText}>
                  {t('change_pass')}
                </RN.Text>
              </RN.View>
            </RN.View>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image source={{uri: 'arrowright'}} style={styles.iconRight} />
            </RN.View>
          </RN.TouchableOpacity>
        )}
        {isChangeLanguage && (
          <>
            {<RN.View style={{marginTop: 10}} />}
            <RN.TouchableOpacity
              style={styles.listItemWrapper}
              onPress={onPressChangeLG}>
              <RN.View style={{flexDirection: 'row'}}>
                <RN.Image source={{uri: 'lg'}} style={styles.icon} />
                <RN.View style={{justifyContent: 'center'}}>
                  <RN.Text style={styles.listItemText}>
                    {t('select_language')}
                  </RN.Text>
                </RN.View>
              </RN.View>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'arrowright'}}
                  style={styles.iconRight}
                />
              </RN.View>
            </RN.TouchableOpacity>
            {isSocialAuth && <RN.View style={{marginTop: -12}} />}
          </>
        )}
        <RN.View style={styles.line} />
        <RN.TouchableOpacity
          style={styles.listItemWrapper}
          onPress={() => {
            RN.Linking.openURL('https://danceconnect.online/terms.html');
          }}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image source={{uri: 'info'}} style={styles.icon} />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.listItemText}>
                {t('terms_condition')}
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image source={{uri: 'arrowright'}} style={styles.iconRight} />
          </RN.View>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          style={styles.listItemWrapper}
          onPress={() => {
            RN.Linking.openURL('https://danceconnect.online/privacy.html');
          }}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image source={{uri: 'info'}} style={styles.icon} />
            </RN.View>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text
                style={[styles.listItemText, {maxWidth: SCREEN_WIDTH - 100}]}>
                {t('privacy')}
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image source={{uri: 'arrowright'}} style={styles.iconRight} />
          </RN.View>
        </RN.TouchableOpacity>

        <RN.TouchableOpacity
          style={styles.listItemWrapper}
          onPress={() => {
            RN.Linking.openURL('https://danceconnect.online/payouts.html');
          }}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image source={{uri: 'info'}} style={styles.icon} />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.listItemText}>{t('payouts')}</RN.Text>
            </RN.View>
          </RN.View>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image source={{uri: 'arrowright'}} style={styles.iconRight} />
          </RN.View>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          style={styles.listItemWrapper}
          onPress={() => {
            RN.Linking.openURL('mailto:dance.connect@incode-systems.com');
          }}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image source={{uri: 'message'}} style={styles.icon} />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.listItemText}>{t('contact')}</RN.Text>
            </RN.View>
          </RN.View>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image source={{uri: 'arrowright'}} style={styles.iconRight} />
          </RN.View>
        </RN.TouchableOpacity>

        <RN.TouchableOpacity
          style={styles.listItemWrapper}
          onPress={() => logoutRefModalize?.current?.open()}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image source={{uri: 'logout'}} style={styles.logoutIcon} />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.listItemTextLogout}>{t('logout')}</RN.Text>
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>

        <RN.TouchableOpacity
          style={styles.listItemWrapper}
          onPress={() => deleteAccountModazile.current?.open()}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image source={{uri: 'basket'}} style={styles.logoutIcon} />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.listItemTextLogout}>
                {t('del_acc')}
              </RN.Text>
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={logoutRefModalize}
          handlePosition="inside">
          <RN.Text style={styles.logoutModalTitle}>
            {t('logout_question')}
          </RN.Text>
          <RN.View style={styles.logoutModalWrapper}>
            <RN.TouchableOpacity
              style={styles.logoutCancelBtn}
              onPress={() => logoutRefModalize?.current?.close()}>
              <RN.Text style={styles.logoutCancelText}>{t('cancel')}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}>
              <RN.Text style={styles.logoutText}>{t('y_logout')}</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </Modalize>
      </Portal>
      <Portal>
        <Modalize
          handlePosition="inside"
          ref={changePassRefModalize}
          modalStyle={{marginTop: SCREEN_HEIGHT * 0.8}}>
          <RN.TouchableOpacity
            style={styles.closeIconWrapper}
            onPress={() => {
              changePassRefModalize?.current?.close();
              setNewPassword('');
            }}>
            <RN.Image source={{uri: 'close'}} style={{height: 24, width: 24}} />
          </RN.TouchableOpacity>
          <RN.Text style={styles.newPasswordTitle}>
            Change account password
          </RN.Text>
          <RN.View style={styles.inputPasswordInput}>
            <Input
              value={newPassword?.toLowerCase()}
              onChange={setNewPassword}
              placeholder="Enter your new password"
              autoFocus
            />
            {visibleError && (
              <RN.Text style={styles.errorMessage}>
                {errorsWithChangePassword?.message}
              </RN.Text>
            )}
          </RN.View>
          <Button
            onPress={onPressChangePassword}
            title="Change password"
            disabled={newPassword.length > 0}
          />
        </Modalize>
      </Portal>
      <Portal>
        <Modalize
          withHandle={false}
          adjustToContentHeight
          closeOnOverlayTap={false}
          panGestureEnabled={false}
          modalStyle={styles.modalContainer}
          ref={successChangePassRefModalize}>
          <RN.View style={{paddingTop: 14}} />
          <RN.Text style={styles.changePasswordSuccessTitle}>
            Your password is successfully changed, please log in again
          </RN.Text>
          <RN.View style={styles.tickContainer}>
            <RN.Image style={styles.tickIcon} source={{uri: 'tick'}} />
          </RN.View>
          <RN.TouchableOpacity
            style={styles.changePasswordSuccessBtn}
            onPress={logout}>
            <RN.Text style={styles.logoutText}>Logout</RN.Text>
          </RN.TouchableOpacity>
        </Modalize>
      </Portal>
      <Portal>
        <Modalize
          withHandle={false}
          adjustToContentHeight
          closeOnOverlayTap={false}
          panGestureEnabled={false}
          modalStyle={styles.modalContainer}
          ref={deleteAccountModazile}>
          <RN.Text style={styles.deleteAccountTitle}>
            {t('del_acc_question')}
          </RN.Text>
          {/* <RN.Text style={styles.deleteAccountDesc}>
            All your created communities and events will also be deleted
          </RN.Text> */}
          <RN.View
            style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <RN.TouchableOpacity
              style={styles.deleteAccountBtnCancel}
              onPress={() => deleteAccountModazile?.current?.close()}>
              <RN.Text style={styles.deleteTextCancel}>{t('cancel')}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              style={styles.deleteAccountBtn}
              onPress={onPressDeleteAccount}>
              <RN.Text style={styles.deleteText}>{t('y_delete')}</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </Modalize>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  deleteText: {
    paddingHorizontal: 34,
    fontSize: 18,
    lineHeight: 22.4,
    color: colors.white,
    textAlign: 'center',
    paddingVertical: 14,
    fontWeight: '600',
  },
  deleteTextCancel: {
    paddingHorizontal: 34,
    fontSize: 18,
    lineHeight: 22.4,
    color: colors.white,
    textAlign: 'center',
    paddingVertical: 14,
    fontWeight: '600',
  },
  deleteAccountBtnCancel: {
    borderRadius: 100,
    backgroundColor: colors.orange,
    marginVertical: 22,
    marginTop: 0,
  },
  deleteAccountBtn: {
    borderRadius: 100,
    backgroundColor: colors.redError,
    marginVertical: 22,
    marginTop: 0,
    justifyContent: 'center',
  },
  deleteAccountTitle: {
    textAlign: 'center',
    padding: 18,
    fontSize: 22,
    lineHeight: 24.6,
    fontWeight: '600',
    paddingTop: 34,
    paddingBottom: 24,
    color: colors.textPrimary,
  },
  deleteAccountDesc: {
    textAlign: 'center',
    padding: 18,
    fontSize: 18,
    lineHeight: 24.6,
    paddingTop: 0,
    color: colors.textPrimary,
  },
  tickContainer: {
    backgroundColor: colors.orange,
    alignSelf: 'center',
    margin: 22,
    padding: 14,
    borderRadius: 100,
  },
  tickIcon: {
    height: 40,
    width: 40,
    tintColor: colors.white,
  },
  modalContainer: {
    position: 'absolute',
    right: 20,
    left: 20,
    bottom: '35%',
    borderRadius: 12,
  },
  changePasswordSuccessBtn: {
    borderRadius: 100,
    backgroundColor: colors.orange,
    marginHorizontal: 24,
    marginVertical: 22,
    marginTop: 0,
  },
  changePasswordSuccessTitle: {
    textAlign: 'center',
    paddingTop: 18,
    fontSize: 22,
    lineHeight: 24.6,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  errorMessage: {
    marginTop: -14,
    color: colors.redError,
    textAlign: 'center',
  },
  closeIconWrapper: {
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputPasswordInput: {
    paddingBottom: 44,
  },
  newPasswordTitle: {
    textAlign: 'center',
    paddingVertical: 44,
    paddingTop: 24,
    fontSize: 22,
    lineHeight: 24.6,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  logoutModalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 34,
  },
  logoutModalTitle: {
    textAlign: 'center',
    paddingVertical: 44,
    fontSize: 22,
    lineHeight: 24.6,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  logoutBtn: {
    borderRadius: 100,
    backgroundColor: colors.orange,
    width: '45%',
  },
  logoutText: {
    color: colors.white,
    fontSize: 18,
    paddingVertical: 18,
    textAlign: 'center',
  },
  logoutCancelBtn: {
    borderRadius: 100,
    backgroundColor: colors.tranparentOrange,
    width: '45%',
  },
  logoutCancelText: {
    color: colors.orange,
    fontSize: 18,
    paddingVertical: 18,
    textAlign: 'center',
  },
  line: {
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 14,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 24,
    borderBottomColor: colors.gray,
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
    fontFamily: 'Lato-Regular',
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
    marginTop: 16,
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
    fontSize: SCREEN_WIDTH <= 375 ? 15 : 18,
    lineHeight: 25.2,
    paddingLeft: 20,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  listItemTextLogout: {
    fontSize: 18,
    lineHeight: 25.2,
    paddingLeft: 20,
    color: colors.redError,
  },
  locationText: {
    fontSize: 16,
    lineHeight: 22.4,
    paddingRight: 20,
    color: colors.darkGray,
  },
  iconRight: {
    height: 14,
    width: 14,
    tintColor: colors.textPrimary,
  },
  logoutIcon: {
    height: 28,
    width: 28,
    tintColor: colors.redError,
  },
  icon: {
    height: 28,
    width: 28,
    tintColor: '#424242',
  },
});
