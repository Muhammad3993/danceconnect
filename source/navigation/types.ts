import {createNavigationContainerRef} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';

export const navigationRef = createNavigationContainerRef();

export type AuthStackNavigationParamList = {
  [x: string]: any;
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
export type MainStackNavigationParamList = {
  [x: string]: any;
  MAIN: {
    name: 'HomeScreen';
    params: null;
  };
};

export type MainNavigationPop = StackScreenProps<
  MainStackNavigationParamList,
  'MAIN'
>;

export type AuthNavigationProp = StackScreenProps<
  AuthStackNavigationParamList,
  'AUTH'
>;
export type RegNavigationProp = StackScreenProps<
  AuthStackNavigationParamList,
  'REGISTRATION'
>;
export type WelcomeNavigationProp = StackScreenProps<
  AuthStackNavigationParamList,
  'WELCOME'
>;
export type OnboardingNavigationProp = StackScreenProps<
  AuthStackNavigationParamList,
  'ONBOARDING'
>;
export type RootStackNavigationParamList = {
  AUTH_STACK: React.ReactElement;
  MAIN_STACK: React.ReactElement;
};
