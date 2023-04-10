import {StackScreenProps} from '@react-navigation/stack';
export type AuthStackNavigationParamList = {
  [x: string]: any;
  AUTH: {
    name: 'Authorization';
    params: null;
  };
  REGISTRATION: {
    name: 'Registration';
    params: null;
  };
};
export type AuthNavigationProp = StackScreenProps<
  AuthStackNavigationParamList,
  'AUTH'
>;
export type RootStackNavigationParamList = {
  AUTH_STACK: undefined;
};
