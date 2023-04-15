import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  AuthStackNavigationParamList,
  MainStackNavigationParamList,
  // RootStackNavigationParamList,
} from './types';
import WeclomeScreen from '../screens/Auth/WelcomeScreen';
import RegistraionScreen from '../screens/Auth/Registration';
import AuthorizationScreen from '../screens/Auth/Autorization';
import useRegistration from '../hooks/useRegistration';
import HomeScreen from '../screens/Home';
import Board from '../screens/Auth/Board';

// const RootStack = createStackNavigator<RootStackNavigationParamList>();
const AuthStack = createStackNavigator<AuthStackNavigationParamList>();
const MainStack = createStackNavigator<MainStackNavigationParamList>();

const AuthNavigor = () => {
  return (
    <AuthStack.Navigator
      initialRouteName={'WELCOME'}
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <AuthStack.Screen name={'WELCOME'} component={WeclomeScreen} />
      <AuthStack.Screen name={'REGISTRATION'} component={RegistraionScreen} />
      <AuthStack.Screen name={'AUTH'} component={AuthorizationScreen} />
      <AuthStack.Screen name={'ONBOARDING'} component={Board} />
    </AuthStack.Navigator>
  );
};
const MainNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name={'HOME'} component={HomeScreen} />
    </MainStack.Navigator>
  );
};
const AppNavigator = () => {
  const {isUserExists} = useRegistration();
  return (
    <NavigationContainer>
      {isUserExists ? <MainNavigator /> : <AuthNavigor />}
      {/* <RootStack.Navigator screenOptions={{headerShown: false}}> */}
      {/* <AuthNavigor /> */}
      {/* </RootStack.Navigator> */}
    </NavigationContainer>
  );
};

export default AppNavigator;
