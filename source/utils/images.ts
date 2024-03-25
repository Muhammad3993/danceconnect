export const defaultProfile = require('../assets/images/defaultuser.png');

export const getDefaultImgUser = (name: string | undefined) => {
  switch (name) {
    case 'Male':
      return {uri: 'male'};
    case 'Female':
      return {uri: 'female'};
    case 'Nonbinary':
      return {uri: 'nonbinary'};
    default:
      return defaultProfile;
  }
};
