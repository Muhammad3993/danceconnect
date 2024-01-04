import {
  // authWithEmail,
  onAppleButtonPress,
  // onFacebookButtonPress,
} from '../api/authSocial';
import i18n from '../i18n/i118n';
import {isAndroid} from './constants';

export const authButtons = [
  {
    key: 0,
    title: i18n.t('auth_btn_goolge'),
    icon: 'google',
    isAvailable: true,
  },
  {
    key: 1,
    title: i18n.t('auth_btn_apple'),
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
    title: i18n.t('auth_btn_email'),
    // title: 'Sign up with Email',
    icon: 'mail',
    navigateTo: 'REGISTRATION',
    isAvailable: true,
  },
];
