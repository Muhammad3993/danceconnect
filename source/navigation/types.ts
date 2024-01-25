import {createNavigationContainerRef} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';

export const navigationRef = createNavigationContainerRef();

export type MainStackNavigationParamList = {
  [x: string]: any;
  MAIN: {
    name: 'HomeScreen';
    params: null;
  };
  AUTH: {
    name: 'Authorization';
    params: null;
  };
  REGISTRATION: {
    name: 'CreateAccount';
    params: null;
  };
  WELCOME: {
    name: 'Welcome';
    params: null;
  };
  ONBOARDING: {
    name: 'Onboarding';
    params: null;
  };
};

export type MainNavigationPop = StackScreenProps<
  MainStackNavigationParamList,
  'MAIN'
>;

export type RootStackNavigationParamList = {
  AUTH_STACK: React.ReactElement;
  MAIN_STACK: React.ReactElement;
};
