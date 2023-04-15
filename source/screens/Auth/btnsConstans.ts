import {
  // authWithEmail,
  onAppleButtonPress,
  // onFacebookButtonPress,
} from '../../api/authSocial';

export const authButtons = [
  {
    key: 0,
    title: 'Continue with Google',
    icon: 'google',
  },
  {
    key: 1,
    title: 'Continue with Apple',
    icon: 'apple',
    onPress: () => onAppleButtonPress(),
  },
  {
    key: 2,
    title: 'Continue with Facebook',
    icon: 'facebook',
    // onPress: () => onFacebookButtonPress(),
  },
  {
    key: 3,
    title: 'Sign up with Email',
    icon: 'mail',
    navigateTo: 'REGISTRATION',
  },
];
