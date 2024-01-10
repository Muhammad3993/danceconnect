import {call, debounce, put, select, takeLatest} from 'redux-saga/effects';
import {PROFILE} from '../actionTypes/profileActionTypes';
import {
  changePasswordFailAction,
  changePasswordSuccessAction,
  changeUserCountrySuccessAction,
  changeUserDanceStylesFailAction,
  changeUserDanceStylesSuccessAction,
  changeUserInformationFailAction,
  changeUserInformationRequestAction,
  changeUserInformationSuccessAction,
  getUserByIdFailAction,
  getUserByIdSuccessAction,
  getUserDataFailAction,
  getUserDataRequestAction,
  getuserDataSuccessAction,
} from '../actions/profileActions';
import {
  selectRegistrationState,
  selectUser,
  selectUserUid,
  selectorSocialProvider,
  selectorToken,
} from '../selectors/registrationSelector';
// import {
//   changeUserDanceStyles,
//   changeUserPassword,
//   getUserData,
//   getUserDataById,
// } from '../../api/functions';
import {getCommunitiesRequestAction} from '../actions/communityActions';
import {getEventsRequestAction} from '../actions/eventActions';
import {
  setLoadingAction,
  setNoticeMessage,
  setNoticeVisible,
} from '../actions/appStateActions';
import {navigationRef} from '../../navigation/types';
import {CommonActions} from '@react-navigation/native';
import {setErrors} from '../../utils/helpers';
import {
  getUserById,
  refreshPassword,
  updateUserById,
  updateUserCountry,
} from '../../api/serverRequests';
import {
  authWithGoogleSuccess,
  registrationWithEmailSuccess,
} from '../actions/authorizationActions';

// function* getUserDataRequest() {
//   try {
//     const uid = yield select(selectUserUid);
//     const data = yield call(getUserData, uid);

//     console.log('getUserDataRequest', data, '\n ------', uid);
//     yield put(
//       getuserDataSuccessAction({
//         userData: data,
//       }),
//     );
//     yield put(getCommunitiesRequestAction());
//     yield put(getEventsRequestAction());
//   } catch (error: any) {
//     yield put(getUserDataFailAction(error));
//   }
// }
function* getUserByIdRequest() {
  try {
    const userUid = yield select(selectUserUid);
    const token = yield select(selectorToken);
    const authProvider = yield select(selectorSocialProvider);
    const user = yield call(getUserById, userUid);
    yield put(
      registrationWithEmailSuccess({
        currentUser: user,
        isUserExists: true,
        token: token,
        authProvider: authProvider,
      }),
    );
    yield put(
      getUserByIdSuccessAction({
        userByIdData: yield call(getUserById, userUid),
      }),
    );
  } catch (error) {
    yield put(getUserByIdFailAction());
  }
}
function* changeInformation(action: any) {
  const {name, gender, profileImg} = action?.payload;
  try {
    yield put(setLoadingAction({onLoading: true}));
    const crntUser = yield select(selectUser);
    const data = {
      userName: name,
      userGender: gender,
      userImage: profileImg,
      jwt: {
        userId: crntUser.id,
      },
    };
    const user = yield call(updateUserById, data);
    const token = yield select(selectorToken);
    const userData = yield select(selectRegistrationState);
    const isAuthGoogle = userData?.authProvider === 'google';
    const isAuthApple = userData?.authProvider === 'apple';
    const authProvider = isAuthApple || isAuthGoogle;
    const userInfo = {
      ...user,
      authProvider: authProvider,
    };
    if (!user) {
      yield put(setNoticeVisible({isVisible: true}));
      yield put(
        setNoticeMessage({
          errorMessage: 'Server error',
        }),
      );
    } else {
      yield put(
        authWithGoogleSuccess({
          currentUser: userInfo,
          isUserExists: true,
          token: token,
        }),
      );

      yield put(changeUserInformationSuccessAction());
      // yield put(getUserDataRequestAction());
      navigationRef.current?.navigate(
        'Profile',
        // CommonActions.navigate({
        //   name: 'Profile',
        // }),
      );
      // navigationRef.current?.dispatch(
      //   CommonActions.navigate({
      //     name: 'Profile',
      //   }),
      // );
    }
    yield put(setLoadingAction({onLoading: false}));
  } catch (error) {
    yield put(setLoadingAction({onLoading: false}));
    yield put(changeUserInformationFailAction());
  }
}
function* changeDanceStyles(action: {danceStyles: string[]}) {
  const {danceStyles} = action?.payload;
  try {
    const crntUser = yield select(selectUser);
    const data = {
      ...crntUser,
      individualStyles: danceStyles,
      jwt: {
        userId: crntUser.id,
      },
    };
    yield put(setLoadingAction({onLoading: true}));
    const user = yield call(updateUserById, data);
    const token = yield select(selectorToken);
    const userData = yield select(selectRegistrationState);
    const isAuthGoogle = userData?.authProvider === 'google';
    const isAuthApple = userData?.authProvider === 'apple';
    const authProvider = isAuthApple || isAuthGoogle;
    const userInfo = {
      ...user,
      authProvider: authProvider,
    };
    if (!user) {
      yield put(setNoticeVisible({isVisible: true}));
      yield put(
        setNoticeMessage({
          errorMessage: 'Server error',
        }),
      );
    } else {
      yield put(
        authWithGoogleSuccess({
          currentUser: userInfo,
          isUserExists: true,
          token: token,
        }),
      );
      yield put(changeUserDanceStylesSuccessAction());
      // yield put(getUserDataRequestAction());
      navigationRef.current?.navigate('Profile');
      // navigationRef.current?.dispatch(
      //   CommonActions.navigate({
      //     name: 'Profile',
      //   }),
      // );
    }
    yield put(setLoadingAction({onLoading: false}));
  } catch (error) {
    yield put(setLoadingAction({onLoading: false}));
    yield put(changeUserDanceStylesFailAction());
  }
}
function* changeUserCountry(action: any) {
  const {userCountry} = action?.payload;
  try {
    const crntUser = yield select(selectUser);
    const data = {
      ...crntUser,
      userCountry: userCountry,
      jwt: {
        userId: crntUser.id,
      },
    };
    yield put(setLoadingAction({onLoading: true}));
    yield put(getCommunitiesRequestAction());
    yield put(getEventsRequestAction({limit: 1, offset: 0}));
    const user = yield call(updateUserCountry, data);
    const token = yield select(selectorToken);
    const userData = yield select(selectRegistrationState);
    const isAuthGoogle = userData?.authProvider === 'google';
    const isAuthApple = userData?.authProvider === 'apple';
    const authProvider = isAuthApple || isAuthGoogle;
    const userInfo = {
      ...user,
      authProvider: authProvider,
    };
    if (!user) {
      yield put(setNoticeVisible({isVisible: true}));
      yield put(
        setNoticeMessage({
          errorMessage: 'Server error',
        }),
      );
    } else {
      yield put(
        authWithGoogleSuccess({
          currentUser: userInfo,
          isUserExists: true,
          token: token,
        }),
      );
      yield put(changeUserCountrySuccessAction());
    }
    yield put(setLoadingAction({onLoading: false}));
  } catch (error) {
    yield put(setLoadingAction({onLoading: false}));
    yield put(changeUserDanceStylesFailAction());
  }
}
function* setNewPassword(action: {
  newPassword: string;
  changePasswordSuccess: boolean;
}) {
  // const {newPassword} = action?.payload;
  // const response = yield call(changeUserPassword, newPassword);
  // yield put(setLoadingAction({onLoading: true}));
  // if (response) {
  //   yield put(
  //     changePasswordFailAction({
  //       changePasswordErrors: setErrors(response?.toString()),
  //       changePasswordSuccess: false,
  //     }),
  //   );
  //   yield put(setLoadingAction({onLoading: false}));
  // }

  // changePasswordSuccessAction({
  //   changePasswordSuccess: true,
  // });
  // yield put(setLoadingAction({onLoading: false}));
  // console.log(response);
  try {
    const crntUser = yield select(selectUser);
    const {newPassword} = action?.payload;
    yield put(setLoadingAction({onLoading: true}));
    // const data = {
    //   new_pass: newPassword,
    // };
    const data = {
      new_pass: newPassword,
      jwt: {
        userId: crntUser.id,
      },
    };
    const response = yield call(refreshPassword, data);
    // yield put(
    //   changePasswordSuccessAction({
    //     changePasswordSuccess: yield call(changeUserPassword, newPassword)
    //       ? true
    //       : false,
    //   }),
    // );
    console.log('refreshPassword', response);
    if (response?.status !== 201) {
      yield put(
        changePasswordFailAction({
          changePasswordSuccess: false,
          changePasswordErrors: setErrors(response?.toString()),
        }),
      );
      yield put(setLoadingAction({onLoading: false}));
    } else {
      yield put(
        changePasswordSuccessAction({
          changePasswordSuccess: true,
        }),
      );
    }

    // console.log('setNewPassword', response);
    yield put(setLoadingAction({onLoading: false}));
  } catch (error) {
    console.log('setNewPassword', error);
    yield put(
      changePasswordFailAction({
        changePasswordSuccess: false,
        changePasswordErrors: setErrors(error?.toString()),
      }),
    );
    yield put(setLoadingAction({onLoading: false}));
  }
}
function* profileSaga() {
  // yield takeLatest(PROFILE.GET_DATA_REQUEST, getUserDataRequest);
  yield takeLatest(PROFILE.GET_USER_BY_ID_REQUEST, getUserByIdRequest);
  yield takeLatest(PROFILE.CHANGE_DATA_REQUEST, changeInformation);
  yield takeLatest(PROFILE.CHANGE_DANCE_STYLES_REQUEST, changeDanceStyles);
  yield takeLatest(PROFILE.CHANGE_USER_COUNTRY_REQUEST, changeUserCountry);
  yield takeLatest(PROFILE.CHANGE_PASSWORD_REQUEST, setNewPassword);
}

export default profileSaga;
