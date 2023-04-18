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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from '../utils/colors';
import BottomTabs from '../components/bottomTabs';
import ProfileScreen from '../screens/Profile';
import CommunitiesScreen from '../screens/Communities';
import EventsScreen from '../screens/Events';

// const RootStack = createStackNavigator<RootStackNavigationParamList>();
const AuthStack = createStackNavigator<AuthStackNavigationParamList>();
const MainStack = createStackNavigator<MainStackNavigationParamList>();
const Tabs = createBottomTabNavigator();

const TabsNavigator = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.darkGray,
      }}
      tabBar={props => <BottomTabs {...props} />}>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Communities" component={CommunitiesScreen} />
      <Tabs.Screen name="Events" component={EventsScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
};

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
    <MainStack.Navigator
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <MainStack.Screen name={'TABS'} component={TabsNavigator} />
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
