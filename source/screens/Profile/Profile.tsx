import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import useRegistration from '../../hooks/useRegistration';
import {useProfile} from '../../hooks/useProfile';
import colors from '../../utils/colors';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  statusBarHeight,
} from '../../utils/constants';
import database from '@react-native-firebase/database';
import {useCommunities} from '../../hooks/useCommunitites';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {navigationRef} from '../../navigation/types';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {Input} from '../../components/input';
import {Button} from '../../components/Button';
import FindCity from '../../components/findCity';
import {setUserCountry} from '../../api/functions';
import useAppStateHook from '../../hooks/useAppState';
import {removeAccount} from '../../api/authSocial';
import {useDispatch} from 'react-redux';
import {logoutSuccess} from '../../store/actions/authorizationActions';
import { deleteUser } from '../../api/serverRequests';
// import axios from 'axios';
// import { createUser } from '../../api/serverRequests';

const ProfileScreen = () => {
  const {logout} = useRegistration();
  const {
    userCountry,
    userImgUrl,
    userName,
    isSuccessChangePassword,
    onChangePassword,
    errorsWithChangePassword,
    isSocialAuth,
    getCurrentUser,
  } = useProfile();
  const {onChoosedCity} = useAppStateHook();
  const dispatch = useDispatch();
  const {managingCommunity} = useCommunities();
  const navigation = useNavigation();
  const [userData, setUserData] = useState();
  const {userUid, currentUser} = useRegistration();
  const [newPassword, setNewPassword] = useState('');
  const [visibleError, setVisibleError] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState();

  const logoutRefModalize = useRef<Modalize>(null);
  const changePassRefModalize = useRef<Modalize>(null);
  const successChangePassRefModalize = useRef<Modalize>(null);
  const deleteAccountModazile = useRef<Modalize>(null);

  // const onPressAuth = () => {
  //   // const data = {
  //   //   email: 'y.balaev@ya.ru',
  //   //   password: 'qwerty123',
  //   //   fullName: 'Yanis Balaev',
  //   //   mobile_phone: '12314',
  //   // };
  //   const data = {
  //     mobile_phone: '+79817770964',
  //     fullName: 'Yanis Balaev',
  //     email: 'y.balaev@yandex.ru',
  //     password: 'qwerty123',
  //   };

  //   createUser(data);
  // };

  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const onValueChange = database()
      .ref(`users/${userUid}`)
      .on('value', snapshot => {
        setUserData(snapshot.val());
      });

    return () => database().ref(`users/${userUid}`).off('value', onValueChange);
  }, [userUid]);
  const onPressChangeProfile = () => {
    navigation.navigate('ChangeProfile');
  };

  useEffect(() => {
    if (isSuccessChangePassword) {
      changePassRefModalize?.current?.close();
      successChangePassRefModalize?.current?.open();
      // RN.Alert.alert('Please, log in again');
    }
  }, [isSuccessChangePassword]);

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

  const onPressChangePassword = () => {
    onChangePassword(newPassword);
  };

  const onPressCommunities = () => {
    // navigationRef.current?.dispatch(
    //   CommonActions.reset({
    //     index: 1,
    //     routes: [
    //       {name: 'Profile'},
    //       {
    //         name: 'CommunitiesMain',
    //         key: 'CommunitiesMain',
    //         params: {createdCommunity: true},
    //       },
    //       // {
    //       //   name: 'CommunitiesMain',
    //       //   params: {createdCommunity: true},
    //       // },
    //     ],
    //   }),
    // );
    // navigationRef.current?.dispatch(
    //   CommonActions.navigate({
    //     name: 'Communities',
    //     params: {
    //       createdCommunity: true,
    //     },
    //   }),
    // );
    // console.log('createdCommunity: true');
    navigation.navigate('ManagingCommunities');
  };
  const onPressDanceStyles = () => {
    navigation.navigate('ProfileDanceStyles');
  };
  // console.log(selectedLocation);
  const onPressChoosedCountry = (value: any) => {
    // const country =
    //   value?.structured_formatting?.main_text + ', ' + value?.terms[1].value;
    // console.log(value);
    onChoosedCity(value);
    setSelectedLocation(value);
    setUserCountry(value);
    getCurrentUser();
  };

  const onPressDeleteAccount = () => {
    deleteAccountModazile.current?.close();
    deleteUser(userUid);
    removeAccount();
    dispatch(logoutSuccess());
  };

  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  return (
    <>
      <RN.ScrollView style={styles.container}>
        <RN.View style={styles.header}>
          <RN.Image
            source={
              userImgUrl?.base64?.length > 0
                ? {
                    uri: 'data:image/png;base64,' + userImgUrl?.base64,
                  }
                : require('../../assets/images/defaultuser.png')
            }
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
              <RN.Text style={styles.editProfileText}>Edit profile</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
        <RN.View style={styles.listWrapper}>
          <RN.TouchableOpacity
            style={styles.listItemWrapper}
            onPress={onPressCommunities}>
            <RN.View style={{flexDirection: 'row'}}>
              <RN.Image source={{uri: 'comoutline'}} style={styles.icon} />
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.listItemText}>
                  Manage my communities
                  {managingCommunity?.length > 0 && (
                    <RN.Text
                      style={{
                        color: colors.darkGray,
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
            onPress={onPressDanceStyles}>
            <RN.View style={{flexDirection: 'row'}}>
              <RN.Image source={{uri: 'dancestyles'}} style={styles.icon} />
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.listItemText}>
                  Manage my dance styles
                  {userData?.individualStyles?.length > 0 && (
                    <RN.Text
                      style={{
                        color: colors.darkGray,
                      }}>{` (${userData?.individualStyles?.length})`}</RN.Text>
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
          <RN.TouchableOpacity
            style={styles.listItemWrapper}
            onPress={() => setOpenLocation(true)}>
            <RN.View style={{flexDirection: 'row'}}>
              <RN.Image source={{uri: 'locateoutline'}} style={styles.icon} />
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.listItemText}>Location</RN.Text>
              </RN.View>
            </RN.View>
            <RN.View style={{flexDirection: 'row'}}>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.locationText}>
                  {currentUser?.userCountry}
                </RN.Text>
              </RN.View>
              <RN.Image source={{uri: 'arrowright'}} style={styles.iconRight} />
            </RN.View>
          </RN.TouchableOpacity>
          {isSocialAuth && <RN.View style={{marginTop: -12}} />}
          {!isSocialAuth && (
            <RN.TouchableOpacity
              style={styles.listItemWrapper}
              onPress={() => changePassRefModalize?.current?.open()}>
              <RN.View style={{flexDirection: 'row'}}>
                <RN.Image source={{uri: 'shield'}} style={styles.icon} />
                <RN.View style={{justifyContent: 'center'}}>
                  <RN.Text style={styles.listItemText}>Change password</RN.Text>
                </RN.View>
              </RN.View>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'arrowright'}}
                  style={styles.iconRight}
                />
              </RN.View>
            </RN.TouchableOpacity>
          )}

          <RN.View style={styles.line} />
          <RN.TouchableOpacity
            style={styles.listItemWrapper}
            onPress={() => {
              RN.Linking.openURL('https://www.danceconnect.online/terms');
            }}>
            <RN.View style={{flexDirection: 'row'}}>
              <RN.Image source={{uri: 'info'}} style={styles.icon} />
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.listItemText}>
                  Terms & Conditions
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
              RN.Linking.openURL('https://www.danceconnect.online/privacy');
            }}>
            <RN.View style={{flexDirection: 'row'}}>
              <RN.Image source={{uri: 'info'}} style={styles.icon} />
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.listItemText}>Privacy Policy</RN.Text>
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
                <RN.Text style={styles.listItemTextLogout}>Logout</RN.Text>
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
                  Delete account
                </RN.Text>
              </RN.View>
            </RN.View>
          </RN.TouchableOpacity>
        </RN.View>
      </RN.ScrollView>
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={logoutRefModalize}
          handlePosition="inside">
          <RN.Text style={styles.logoutModalTitle}>
            Are you sure you want to log out?
          </RN.Text>
          <RN.View style={styles.logoutModalWrapper}>
            <RN.TouchableOpacity
              style={styles.logoutCancelBtn}
              onPress={() => logoutRefModalize?.current?.close()}>
              <RN.Text style={styles.logoutCancelText}>Cancel</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <RN.Text style={styles.logoutText}>Yes, Logout</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </Modalize>
      </Portal>
      <Portal>
        <Modalize
          handlePosition="inside"
          ref={changePassRefModalize}
          modalStyle={{marginTop: statusBarHeight * 2}}>
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
      {openLocation && (
        <Portal>
          <FindCity
            selectedLocation={selectedLocation}
            setSelectedLocation={onPressChoosedCountry}
            onClosed={() => setOpenLocation(false)}
          />
        </Portal>
      )}
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
            Do you really want to delete your account?
          </RN.Text>
          <RN.Text style={styles.deleteAccountDesc}>
            All your created communities and events will also be deleted
          </RN.Text>
          <RN.View
            style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <RN.TouchableOpacity
              style={styles.deleteAccountBtnCancel}
              onPress={() => deleteAccountModazile?.current?.close()}>
              <RN.Text style={styles.deleteTextCancel}>Cancel</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              style={styles.deleteAccountBtn}
              onPress={onPressDeleteAccount}>
              <RN.Text style={styles.deleteText}>Yes, delete</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </Modalize>
      </Portal>
    </>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: statusBarHeight * 2,
    paddingHorizontal: 24,
  },
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
  },
  listItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  listItemText: {
    fontSize: 18,
    lineHeight: 25.2,
    paddingLeft: 20,
    color: colors.textPrimary,
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
    height: 20,
    width: 20,
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
    tintColor: colors.textPrimary,
  },
});

export default ProfileScreen;
