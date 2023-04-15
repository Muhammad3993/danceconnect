import {firebase} from '@react-native-firebase/database';

export const userExists = async (uid: string) => {
  const snap = await firebase.database().ref(`users/${uid}`).once('value');
  return snap.exists();
};
