import {
  // authWithEmail,
  onAppleButtonPress,
  // onFacebookButtonPress,
} from '../api/authSocial';
import {isAndroid} from './constants';

export const authButtons = [
  {
    key: 0,
    title: 'Continue with Google',
    icon: 'google',
    isAvailable: true,
  },
  {
    key: 1,
    title: 'Continue with Apple',
    icon: 'apple',
    onPress: () => onAppleButtonPress(),
    isAvailable: !isAndroid,
  },
  // {
  //   key: 2,
  //   title: 'Continue with Facebook',
  //   icon: 'facebook',
  //   isAvailable: false,
  //   // onPress: () => onFacebookButtonPress(),
  // },
  {
    key: 2,
    title: 'Sign up with Email',
    icon: 'mail',
    navigateTo: 'REGISTRATION',
    isAvailable: true,
  },
];
