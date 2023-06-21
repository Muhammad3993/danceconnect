import moment from 'moment';
export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))?/;
  const re2 = /\S+@\S+\.\S\S+/;
  return (
    re.test(String(email).toLowerCase()) &&
    re2.test(String(email).toLowerCase())
  );
};

export let minWeekDay = moment.updateLocale('en', {
  weekdaysMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
});

export const setErrors = (valueError: string) => {
  // console.log('setErrors', valueError);
  if (valueError?.includes('auth/wrong-password')) {
    return {
      message: 'Password or email incorrect',
      type: ['email', 'password'],
    };
  }
  if (valueError?.includes('auth/too-many-requests')) {
    return {
      message: 'Many requests.',
      type: ['email', 'password'],
    };
  }
  if (valueError?.includes('auth/user-not-found')) {
    return {
      message: 'Password or email incorrect.',
      type: ['email', 'password'],
    };
  }
  if (valueError?.includes('auth/email-already-in-use')) {
    return {
      message: 'Email is already taken. Try to log in instead',
      type: ['email', 'password'],
    };
  }
  if (valueError?.includes('auth/network-request-failed')) {
    return {
      message: 'Network error',
      type: [],
    };
  }
  if (valueError?.includes('auth/invalid-email')) {
    return {
      message: 'Invalid email',
      type: ['email'],
    };
  }
  if (valueError?.includes('auth/weak-password')) {
    return {
      message: 'Weak password',
      type: ['password'],
    };
  }

  return '';
};

export const getIcon = (name: string, isFocused: boolean) => {
  switch (name) {
    case 'Home':
      return isFocused ? 'homefull' : 'homeoutline';
    case 'Communities':
      return isFocused ? 'comfull' : 'comoutline';
    case 'Events':
      return isFocused ? 'ticketfull' : 'ticketoutline';
    case 'Profile':
      return isFocused ? 'profilefull' : 'profileoutline';
    default:
      break;
  }
};
