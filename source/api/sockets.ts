import database from '@react-native-firebase/database';

export const communityDataRealtime = (uid: string) => {
  return database()
    .ref(`community/${uid}`)
    .on('value', snapshot => snapshot.val());
};
export const clearRealTime = (uid: string, onValueChange: any) => {
  return database().ref(`community/${uid}`).off('value', onValueChange);
};
