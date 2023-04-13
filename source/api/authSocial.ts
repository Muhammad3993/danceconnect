import auth from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {config, credentials} from './configFB';
export const onAppleButtonPress = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    return auth().signInWithCredential(appleCredential);
  } catch (error) {
    console.log(error);
  }
};
export const onFacebookButtonPress = async () => {
  try {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    return auth().signInWithCredential(facebookCredential);
  } catch (error) {
    console.log(error);
  }
};

export const sinUpWithEmail = async (email: string, password: string) => {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => user.user)
    .catch(err => {
      throw new Error(err);
    });
};
export const logInWithEmail = async (email: string, password: string) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => user.user)
    .catch(err => {
      throw new Error(err);
    });
};

export const setInitialDataUser = async (
  uid: string,
  name: string,
  gender: string,
  country: string,
  location: string,
  role: string,
) => {
  const newRef = database().ref('users/').push();

  return newRef
    .set({
      name: name,
      gender: gender,
      country: country,
      location: location,
      role: role,
    })
    .then((data: any) => {
      console.log('setInitialDataUser data', data);
      return data;
    });
};

export const logout = async () => {
  return firebase
    .auth()
    .signOut()
    .then((data: any) => console.log('signOut', data));
};

export const initializeFB = async () => {
  await firebase.initializeApp(credentials, config);
};
