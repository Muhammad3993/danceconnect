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
  selectorToken,
} from '../selectors/registrationSelector';
import {
  changeUserDanceStyles,
  changeUserPassword,
  getUserData,
  getUserDataById,
} from '../../api/functions';
import {getCommunitiesRequestAction} from '../actions/communityActions';
import {getEventsRequestAction} from '../actions/eventActions';
import {setLoadingAction} from '../actions/appStateActions';
import {navigationRef} from '../../navigation/types';
import {CommonActions} from '@react-navigation/native';
import {setErrors} from '../../utils/helpers';
import {refreshPassword, updateUserById, updateUserCountry} from '../../api/serverRequests';
import {authWithGoogleSuccess} from '../actions/authorizationActions';

function* getUserDataRequest() {
  try {
    const uid = yield select(selectUserUid);
    const data = yield call(getUserData, uid);

    console.log('getUserDataRequest', data, '\n ------', uid);
    yield put(
      getuserDataSuccessAction({
        userData: data,
      }),
    );
    yield put(getCommunitiesRequestAction());
    yield put(getEventsRequestAction());
  } catch (error: any) {
    yield put(getUserDataFailAction(error));
  }
}
function* getUserByIdRequest(action: any) {
  const {userUid} = action.payload;
  try {
    // yield put(
    //   getUserByIdSuccessAction({
    //     userByIdData: yield call(getUserDataById, userUid),
    //   }),
    // );
  } catch (error) {
    yield put(getUserByIdFailAction());
  }
}
function* changeInformation(action: any) {
  const {name, gender, profileImg} = action?.payload;
  try {
    const data = {
      userName: name,
      userGender: gender,
      userImage: profileImg,
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
    yield put(
      authWithGoogleSuccess({
        currentUser: userInfo,
        isUserExists: true,
        token: token,
      }),
    );

    yield put(changeUserInformationSuccessAction());
    // yield put(getUserDataRequestAction());
    yield put(setLoadingAction({onLoading: false}));
    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'Profile',
      }),
    );
  } catch (error) {
    yield put(setLoadingAction({onLoading: false}));
    yield put(changeUserInformationFailAction());
  }
}
function* changeDanceStyles(action: {danceStyles: string[]}) {
  const {danceStyles} = action?.payload;
  try {
    const data = {
      individualStyles: danceStyles,
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
    yield put(
      authWithGoogleSuccess({
        currentUser: userInfo,
        isUserExists: true,
        token: token,
      }),
    );
    yield put(changeUserDanceStylesSuccessAction());
    // yield put(getUserDataRequestAction());
    yield put(setLoadingAction({onLoading: false}));
    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'Profile',
      }),
    );
  } catch (error) {
    yield put(setLoadingAction({onLoading: false}));
    yield put(changeUserDanceStylesFailAction());
  }
}
function* changeUserCountry(action: {userCountry: string}) {
  const {userCountry} = action?.payload;
  try {
    const data = {
      userCountry: userCountry,
    };
    yield put(setLoadingAction({onLoading: true}));
    yield put(getCommunitiesRequestAction());
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
    yield put(
      authWithGoogleSuccess({
        currentUser: userInfo,
        isUserExists: true,
        token: token,
      }),
    );
    yield put(setLoadingAction({onLoading: false}));
    yield put(changeUserCountrySuccessAction());
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
    const {newPassword} = action?.payload;
    yield put(setLoadingAction({onLoading: true}));
    const data = {
      new_pass: newPassword,
    };
    const response = yield call(refreshPassword, data);
    // yield put(
    //   changePasswordSuccessAction({
    //     changePasswordSuccess: yield call(changeUserPassword, newPassword)
    //       ? true
    //       : false,
    //   }),
    // );
    // console.log(response);
    if (response.code !== 200) {
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
