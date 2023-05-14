import React from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import {createStackNavigator} from '@react-navigation/stack';
import {
  AuthStackNavigationParamList,
  MainStackNavigationParamList,
  navigationRef,
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
import CommunitiesScreen from '../screens/Community/Communities';
import EventsScreen from '../screens/Events/Events';
import CreateCommunity from '../screens/Community/CreateCommunity';
import CommunityScreen from '../screens/Community/CommunityScreen';
import EditCommunity from '../screens/Community/EditCommunity';
import CreateEvent from '../screens/Events/CreateEvent';
import EventScreen from '../screens/Events/EventScreen';

// const RootStack = createStackNavigator<RootStackNavigationParamList>();
const AuthStack = createStackNavigator<AuthStackNavigationParamList>();
const MainStack = createStackNavigator<MainStackNavigationParamList>();
const Tabs = createBottomTabNavigator();

const CommunityStack = createStackNavigator();
const EventsStack = createStackNavigator();
const CommunityNavigator = () => {
  return (
    <CommunityStack.Navigator
      initialRouteName="CommunitiesMain"
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <CommunityStack.Screen
        name="CommunitiesMain"
        component={CommunitiesScreen}
      />
      <CommunityStack.Screen
        name="CreateCommunity"
        component={CreateCommunity}
      />
      <CommunityStack.Screen
        name="CommunityScreen"
        component={CommunityScreen}
      />
      <CommunityStack.Screen name="EditCommunity" component={EditCommunity} />
      <CommunityStack.Screen name="CreateEvent" component={CreateEvent} />
      <CommunityStack.Screen name="EventScreen" component={EventScreen} />
    </CommunityStack.Navigator>
  );
};
const EventsNavigator = () => {
  return (
    <EventsStack.Navigator
      initialRouteName="Events"
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <EventsStack.Screen name="Events" component={EventsScreen} />
      <EventsStack.Screen name="CreateEvent" component={CreateEvent} />
      <EventsStack.Screen name="EventScreen" component={EventScreen} />
    </EventsStack.Navigator>
  );
};
const TabsNavigator = () => {
  return (
    <Tabs.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.darkGray,
        tabBarHideOnKeyboard: true,
        tabBarStyle: (route => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (routeName === 'CreateCommunity') {
            return {display: 'none'};
          }
          if (routeName === 'EditCommunity') {
            return {display: 'none'};
          }
          if (routeName === 'CreateEvent') {
            return {display: 'none'};
          }
          return {display: 'flex'};
        })(route),
      })}
      tabBar={props => <BottomTabs {...props} />}>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Communities" component={CommunityNavigator} />
      <Tabs.Screen name="Events" component={EventsNavigator} />
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
  const routeNameRef = React.useRef();
  // const navigationRef = React.useRef();
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
      {isUserExists ? <MainNavigator /> : <AuthNavigor />}
      {/* <RootStack.Navigator screenOptions={{headerShown: false}}> */}
      {/* <AuthNavigor /> */}
      {/* </RootStack.Navigator> */}
    </NavigationContainer>
  );
};

export default AppNavigator;
