import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  AuthStackNavigationParamList,
  // RootStackNavigationParamList,
} from './types';
import AuthorizationScreen from '../screens/Auth/Authorization';
import RegistraionScreen from '../screens/Auth/Registration';

// const RootStack = createStackNavigator<RootStackNavigationParamList>();
const AuthStack = createStackNavigator<AuthStackNavigationParamList>();

const AuthNavigor = () => {
  return (
    <AuthStack.Navigator
      initialRouteName={'AUTH'}
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <AuthStack.Screen name={'AUTH'} component={AuthorizationScreen} />
      <AuthStack.Screen name={'REGISTRATION'} component={RegistraionScreen} />
    </AuthStack.Navigator>
  );
};
const AppNavigator = () => {
  return (
    <NavigationContainer>
      {/* <RootStack.Navigator screenOptions={{headerShown: false}}> */}
      <AuthNavigor />
      {/* </RootStack.Navigator> */}
    </NavigationContainer>
  );
};

export default AppNavigator;
