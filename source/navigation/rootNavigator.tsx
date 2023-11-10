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
import ProfileScreen from '../screens/Profile/Profile';
import CommunitiesScreen from '../screens/Community/Communities';
import EventsScreen from '../screens/Events/Events';
import CreateCommunity from '../screens/Community/CreateCommunity';
import CommunityScreen from '../screens/Community/CommunityScreen';
import EditCommunity from '../screens/Community/EditCommunity';
import CreateEvent from '../screens/Events/CreateEvent';
import EventScreen from '../screens/Events/EventScreen';
import EditEvent from '../screens/Events/EditEvent';
import {Host} from 'react-native-portalize';
import DanceStylesProfile from '../screens/Profile/EditDanceStylesProfile';
import ChangeProfile from '../screens/Profile/ChangeProfile';
import ManagingCommunities from '../screens/Profile/ManagingCommunities';
import TicketScreen from '../screens/Events/Tickets/Ticket';
import TicketsScreen from '../screens/Profile/Tickets';
import MakeEvent from '../screens/Events/MakeEvent';
import CreateTicket from '../screens/Events/Tickets/CreateTicket';
import {LayoutAnimation} from 'react-native';
import EditTicket from '../screens/Events/Tickets/EditTicket';
import EditEventScreen from '../screens/Events/EditEventScreen';
import BuyTickets from '../screens/Events/Tickets/BuyTickets';
import ImageView from '../components/imageView';
import SoldTickets from '../screens/Events/Tickets/SoldTickets';
import Managers from '../screens/Community/Managers';
import AttendedPeople from '../screens/AttendedPeople';

const AuthStack = createStackNavigator<AuthStackNavigationParamList>();
const MainStack = createStackNavigator<MainStackNavigationParamList>();
const Tabs = createBottomTabNavigator();

const CommunityStack = createStackNavigator();
const EventsStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
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
      <CommunityStack.Screen name="CreateEvent" component={MakeEvent} />
      <CommunityStack.Screen name="EventScreen" component={EventScreen} />
      <CommunityStack.Screen name="EditEvent" component={EditEventScreen} />
      <CommunityStack.Screen name="CreateTicket" component={CreateTicket} />
      <CommunityStack.Screen name="EditTicket" component={EditTicket} />

      <CommunityStack.Screen
        name="Ticket"
        component={TicketScreen}
        options={{
          animationEnabled: true,
          presentation: 'transparentModal',
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <CommunityStack.Screen name="SoldTickets" component={SoldTickets} />
      <CommunityStack.Screen name="Managers" component={Managers} />
      <CommunityStack.Screen name="AttendedPeople" component={AttendedPeople} />
    </CommunityStack.Navigator>
  );
};
const EventsNavigator = () => {
  return (
    <EventsStack.Navigator
      initialRouteName="Events"
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <EventsStack.Screen name="Events" component={EventsScreen} />
      {/* <EventsStack.Screen name="CreateEvent" component={CreateEvent} /> */}
      <EventsStack.Screen name="EventScreen" component={EventScreen} />
      <EventsStack.Screen name="EditEvent" component={EditEventScreen} />
      <EventsStack.Screen name="CreateEvent" component={MakeEvent} />
      <EventsStack.Screen name="CreateTicket" component={CreateTicket} />
      <EventsStack.Screen name="EditTicket" component={EditTicket} />
      <EventsStack.Screen name="BuyTickets" component={BuyTickets} />
      <EventsStack.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          // animationEnabled: true,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <EventsStack.Screen
        name="Ticket"
        component={TicketScreen}
        options={{
          // animationEnabled: true,
          headerShown: false,
          // gestureEnabled: false,
        }}
      />
      {/* <EventsStack.Screen name="ImageView" component={ImageView} /> */}
      <EventsStack.Screen name="SoldTickets" component={SoldTickets} />
      <EventsStack.Screen name="AttendedPeople" component={AttendedPeople} />
    </EventsStack.Navigator>
  );
};
const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="EventScreen" component={EventScreen} />
      <HomeStack.Screen name="EditEvent" component={EditEventScreen} />
      <HomeStack.Screen
        name="Ticket"
        component={TicketScreen}
        options={{
          // animationEnabled: true,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <HomeStack.Screen name="CreateTicket" component={CreateTicket} />
      <HomeStack.Screen name="EditTicket" component={EditTicket} />
      <HomeStack.Screen name="CreateCommunity" component={CreateCommunity} />
      <HomeStack.Screen name="BuyTickets" component={BuyTickets} />
      <HomeStack.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          // animationEnabled: true,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <HomeStack.Screen name="SoldTickets" component={SoldTickets} />
      <HomeStack.Screen name="Managers" component={Managers} />
      <HomeStack.Screen name="AttendedPeople" component={AttendedPeople} />
    </HomeStack.Navigator>
  );
};
const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName="Profile"
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen
        name="ProfileDanceStyles"
        component={DanceStylesProfile}
      />
      <ProfileStack.Screen name="ChangeProfile" component={ChangeProfile} />
      <ProfileStack.Screen
        name="ManagingCommunities"
        component={ManagingCommunities}
      />
      <ProfileStack.Screen name="CommunityScreen" component={CommunityScreen} />
      <ProfileStack.Screen name="EventScreen" component={EventScreen} />
      <ProfileStack.Screen name="EditEvent" component={EditEventScreen} />
      <ProfileStack.Screen name="CreateTicket" component={CreateTicket} />
      <ProfileStack.Screen name="EditTicket" component={EditTicket} />
      <ProfileStack.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          // animationEnabled: true,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <ProfileStack.Screen
        name="Ticket"
        component={TicketScreen}
        options={{
          // animationEnabled: true,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <ProfileStack.Screen name="SoldTickets" component={SoldTickets} />
      <ProfileStack.Screen name="Managers" component={Managers} />
      <ProfileStack.Screen name="AttendedPeople" component={AttendedPeople} />
    </ProfileStack.Navigator>
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
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
          if (routeName === 'CreateTicket') {
            return {display: 'none'};
          }
          if (routeName === 'EditTicket') {
            return {display: 'none'};
          }
          if (routeName === 'EditEvent') {
            return {display: 'none'};
          }
          if (routeName === 'ChangeProfile') {
            return {display: 'none'};
          }
          if (routeName === 'ProfileDanceStyles') {
            return {display: 'none'};
          }
          if (routeName === 'BuyTickets') {
            return {display: 'none'};
          }
          if (routeName === 'Managers') {
            return {display: 'none'};
          }
          if (routeName === 'AttendedPeople') {
            return {display: 'none'};
          }
          // if (routeName === 'Ticket') {
          //   return {display: 'none'};
          // }
          return {display: 'flex'};
        })(route),
      })}
      tabBar={props => <BottomTabs {...props} />}>
      <Tabs.Screen name="Home" component={HomeNavigator} />
      <Tabs.Screen name="Communities" component={CommunityNavigator} />
      <Tabs.Screen name="Events" component={EventsNavigator} />
      <Tabs.Screen name="Profile" component={ProfileNavigator} />
    </Tabs.Navigator>
  );
};

const AuthNavigor = () => {
  return (
    <Host>
      <AuthStack.Navigator
        initialRouteName={'WELCOME'}
        screenOptions={{headerShown: false, gestureEnabled: false}}>
        <AuthStack.Screen name={'WELCOME'} component={WeclomeScreen} />
        <AuthStack.Screen name={'REGISTRATION'} component={RegistraionScreen} />
        <AuthStack.Screen name={'AUTH'} component={AuthorizationScreen} />
        <AuthStack.Screen name={'ONBOARDING'} component={Board} />
      </AuthStack.Navigator>
    </Host>
  );
};
const MainNavigator = () => {
  return (
    <Host>
      <MainStack.Navigator
        screenOptions={{headerShown: false, gestureEnabled: false}}>
        <MainStack.Screen name={'TABS'} component={TabsNavigator} />
        {/* <MainStack.Screen name={'HOME'} component={HomeScreen} /> */}
      </MainStack.Navigator>
    </Host>
  );
};
const AppNavigator = () => {
  const {isUserExists} = useRegistration();
  const routeNameRef = React.useRef();
  // console.log('isUserExists', isUserExists);
  const linking = {
    prefixes: ['https://danceconnect.online/', 'danceconnect://'],
    config: {
      screens: {
        ['TABS']: {
          path: '/',
          screens: {
            ['Communities']: {
              initialRouteName: 'CommunitiesMain',
              screens: {
                ['CommunitiesMain']: {
                  path: 'communities',
                },
                ['CommunityScreen']: {
                  initialRouteName: 'CommunitiesMain',
                  path: 'community/:id',
                  parse: {
                    id: (id: string) => {
                      return id;
                    },
                  },
                },
              },
            },
            ['Events']: {
              initialRouteName: 'Events',
              screens: {
                ['Events']: {
                  path: 'events',
                },
                ['EventScreen']: {
                  initialRouteName: 'Events',
                  path: 'event/:id',
                  parse: {
                    id: (id: string) => {
                      return id;
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef?.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute()?.name;

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
      {/* <MainNavigator /> */}
      {/* </RootStack.Navigator> */}
    </NavigationContainer>
  );
};

export default AppNavigator;
