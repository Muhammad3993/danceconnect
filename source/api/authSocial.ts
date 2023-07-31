import auth from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import jwt_decode from 'jwt-decode';
// import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {config, credentials} from './configFB';
import {removeCommunity, removeEvent} from './functions';
export const logoutApple = async () => {
  await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGOUT,
  });
};
export const onAppleButtonPress = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    // const {identityToken, nonce} = appleAuthRequestResponse;
    const name = appleAuthRequestResponse.fullName;
    const fullName = `${name?.givenName} ${name?.familyName}`;

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      const {email} = jwt_decode(appleAuthRequestResponse?.identityToken);
      const data = {
        email: email,
        uid: appleAuthRequestResponse.nonce,
        userName: fullName,
        user: appleAuthRequestResponse.user,
      };
      return data;
      // user is authenticated
    }
    // const {email, email_verified, is_private_email, sub} = jwt_decode(
    //   appleAuthRequestResponse?.identityToken,
    // );
    // console.log(
    //   'appleAuthRequestResponse',
    //   email,
    //   email_verified,
    //   is_private_email,
    //   sub,
    // );

    if (!appleAuthRequestResponse.identityToken) {
      console.log('Apple Sign-In failed - no identify token returned');
    }

    // const {identityToken, nonce} = appleAuthRequestResponse;
    // const appleCredential = auth.AppleAuthProvider.credential(
    //   identityToken,
    //   nonce,
    // );
    // // Create a Firebase credential from the response
    // const {identityToken, nonce} = appleAuthRequestResponse;
    // const appleCredential = auth.AppleAuthProvider.credential(
    //   identityToken,
    //   nonce,
    // );
    // // Sign the user in with the credential
    // const authenticate = await auth().signInWithCredential(appleCredential);
    // authenticate.user = {...authenticate.user, displayName: fullName};
    // return authenticate;
    // return auth().signInWithCredential(appleCredential);
  } catch (error) {
    console.log(error);
  }
};
// export const onFacebookButtonPress = async () => {
//   try {
//     const result = await LoginManager.logInWithPermissions([
//       'public_profile',
//       'email',
//     ]);

//     if (result.isCancelled) {
//       throw 'User cancelled the login process';
//     }

//     const data = await AccessToken.getCurrentAccessToken();

//     if (!data) {
//       throw 'Something went wrong obtaining access token';
//     }

//     const facebookCredential = auth.FacebookAuthProvider.credential(
//       data.accessToken,
//     );

//     return auth().signInWithCredential(facebookCredential);
//   } catch (error) {
//     console.log(error);
//   }
// };
export const signWithGoogle = async () => {
  GoogleSignin.configure({
    webClientId:
      '510785169210-lf70g9qu4i2htf64g20emmqs2elosoal.apps.googleusercontent.com',
  });
  await GoogleSignin.hasPlayServices();
  const {idToken} = await GoogleSignin.signIn();
  const creds = auth.GoogleAuthProvider.credential(idToken);
  return auth()
    .signInWithCredential(creds)
    .then(user => user.user)
    .catch(err => {
      console.log(err);
    });
};

export const sinUpWithEmail = async (email: string, password: string) => {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => user.user)
    .catch(err => {
      throw new Error(err.code);
    });
};
export const logInWithEmail = async (email: string, password: string) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => user.user)
    .catch(err => {
      throw new Error(err.code);
    });
};

export const forgotPassword = async (email: string) => {
  return firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(er => console.log('forgot password error', er));
};

export const setInitialDataUser = async ({
  uid,
  name,
  gender,
  country,
  location,
  role,
  individualStyles,
}) => {
  // console.log('')
  return database()
    .ref(`users/${uid}`)
    .update({
      name: name,
      gender: gender,
      country: country,
      location: location,
      role: role,
      individualStyles: individualStyles,
    })
    .then();
};

export const logout = async () => {
  return firebase
    .auth()
    .signOut()
    .then((data: any) => console.log('signOut', data));
};

export const removeAccount = async () => {
  const userUid = firebase.auth().currentUser?.uid;
  const userValues = await firebase
    .database()
    .ref(`users/${userUid}`)
    .once('value');
  const userCommunities = userValues?.val()?.myComunitiesIds;
  const userEvents = userValues?.val()?.events;
  if (userCommunities?.length > 0) {
    userCommunities.forEach((communityId: string) => {
      removeCommunity(communityId)
        .then()
        .finally(() => {
          if (userEvents?.length > 0) {
            userEvents.forEach((eventId: string) => {
              removeEvent(eventId).then();
            });
          }
        });
    });
  }
  await database().ref(`users/${userUid}`).remove();
  firebase.auth().currentUser?.delete();
};

export const initializeFB = async () => {
  const {apps} = firebase;
  if (!apps.length) {
    await firebase.initializeApp(credentials, config);
  }
};
