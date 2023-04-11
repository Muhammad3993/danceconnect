import {ImageProps} from 'react-native';

export const getLogoImg = (name: string | undefined | ImageProps) => {
  switch (name) {
    case 'google':
      return require('./source/assets/images/googleicon.png');
    case 'apple':
      return require('./source/assets/images/appleicon.png');

    case 'facebook':
      return require('./source/assets/images/fbicon.png');

    case 'mail':
      return require('./source/assets/images/mail.png');

    default:
      break;
  }
};
