import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
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
import EventScreen from '../screens/Events/EventScreen';
import {Host} from 'react-native-portalize';
import DanceStylesProfile from '../screens/Profile/EditDanceStylesProfile';
import ChangeProfile from '../screens/Profile/ChangeProfile';
import ManagingCommunities from '../screens/Profile/ManagingCommunities';
import TicketScreen from '../screens/Events/Tickets/Ticket';
import TicketsScreen from '../screens/Profile/Tickets';
import MakeEvent from '../screens/Events/MakeEvent';
import CreateTicket from '../screens/Events/Tickets/CreateTicket';
import EditTicket from '../screens/Events/Tickets/EditTicket';
import EditEventScreen from '../screens/Events/EditEventScreen';
import BuyTickets from '../screens/Events/Tickets/BuyTickets';
// import ImageView from '../components/imageView';
import SoldTickets from '../screens/Events/Tickets/SoldTickets';
import Managers from '../screens/Community/Managers';
import AttendedPeople from '../screens/AttendedPeople';
// import {useTranslation} from 'react-i18next';
import ChangeLanguage from '../screens/ChangeLanguage';
import i18n from '../i18n/i118n';
import useAppStateHook from '../hooks/useAppState';
import ManagingEvents from '../screens/Profile/ManagingEvents';
import {ChatsScreen} from '../screens/Chat/Chats';
import {ChatScreen} from '../screens/Chat/Chat';
import {MinChatProvider} from '@minchat/reactnative';
import {MINCHAT_ID} from '../utils/constants';

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
    </CommunityStack.Navigator>
  );
};
const EventsNavigator = () => {
  return (
    <EventsStack.Navigator
      initialRouteName="Events"
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <EventsStack.Screen name="Events" component={EventsScreen} />
      <EventsStack.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <EventsStack.Screen
        name="Ticket"
        component={TicketScreen}
        options={{headerShown: false}}
      />
      <EventsStack.Screen name="SoldTickets" component={SoldTickets} />
    </EventsStack.Navigator>
  );
};
const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="Ticket"
        component={TicketScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <HomeStack.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <HomeStack.Screen name="SoldTickets" component={SoldTickets} />
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
        name="ManagingCommunities"
        component={ManagingCommunities}
      />
      <ProfileStack.Screen name="ManagingEvents" component={ManagingEvents} />
      <ProfileStack.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <ProfileStack.Screen
        name="Ticket"
        component={TicketScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <ProfileStack.Screen name="SoldTickets" component={SoldTickets} />
      <ProfileStack.Screen name={'LANGUAGE'} component={ChangeLanguage} />
    </ProfileStack.Navigator>
  );
};
const TabsNavigator = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.darkGray,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={props => <BottomTabs {...props} />}>
      <Tabs.Screen name={'Home'} component={HomeNavigator} />
      <Tabs.Screen name={'Communities'} component={CommunityNavigator} />
      <Tabs.Screen name={'Events'} component={EventsNavigator} />
      <Tabs.Screen name={'Profile'} component={ProfileNavigator} />
    </Tabs.Navigator>
  );
};

const AppNavigator = () => {
  const {isUserExists, currentUser} = useRegistration();
  const routeNameRef = React.useRef();
  const {crntLgCode} = useAppStateHook();
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
              },
            },
            ['Events']: {
              initialRouteName: 'Events',
              screens: {
                ['Events']: {
                  path: 'events',
                },
              },
            },
            ['EventScreen']: {
              path: 'event/:id',
              parse: {
                id: (id: string) => {
                  return id;
                },
              },
            },
            ['CommunityScreen']: {
              path: 'community/:id',
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
  };

  useEffect(() => {
    if (i18n.language !== crntLgCode) {
      i18n.changeLanguage(crntLgCode);
    }
  }, [crntLgCode]);

  return (
    <MinChatProvider
      // test={__DEV__}
      apiKey={MINCHAT_ID}
      // user={{username: 'micheal', name: 'Micheal Saunders'}}
      user={{username: currentUser?.id, name: currentUser?.userName}}>
      <NavigationContainer
        linking={linking}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current =
            navigationRef?.current?.getCurrentRoute()?.name;
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
        <Host>
          <MainStack.Navigator
            screenOptions={{headerShown: false, gestureEnabled: false}}>
            {isUserExists ? (
              <>
                <MainStack.Screen name={'TABS'} component={TabsNavigator} />
                <MainStack.Screen
                  name="CreateCommunity"
                  component={CreateCommunity}
                />
                <MainStack.Screen
                  name="EditCommunity"
                  component={EditCommunity}
                />

                <MainStack.Screen name="CreateEvent" component={MakeEvent} />
                <MainStack.Screen
                  name="CreateTicket"
                  component={CreateTicket}
                />
                <MainStack.Screen name="EditTicket" component={EditTicket} />
                <MainStack.Screen
                  name="ChangeProfile"
                  component={ChangeProfile}
                />
                <MainStack.Screen
                  name="ProfileDanceStyles"
                  component={DanceStylesProfile}
                />
                <MainStack.Screen name="BuyTickets" component={BuyTickets} />
                <MainStack.Screen name="Managers" component={Managers} />
                <MainStack.Screen
                  name="AttendedPeople"
                  component={AttendedPeople}
                />
                <MainStack.Screen
                  name="Chats"
                  options={{gestureEnabled: true}}
                  component={ChatsScreen}
                />
                <MainStack.Screen
                  name="Chat"
                  options={{gestureEnabled: true}}
                  component={ChatScreen}
                />
                <MainStack.Screen
                  name="EditEvent"
                  component={EditEventScreen}
                />
                <MainStack.Screen name="EventScreen" component={EventScreen} />
                <MainStack.Screen
                  name="CommunityScreen"
                  component={CommunityScreen}
                />
              </>
            ) : (
              <>
                <MainStack.Screen name={'WELCOME'} component={WeclomeScreen} />
                <MainStack.Screen
                  name={'REGISTRATION'}
                  component={RegistraionScreen}
                />
                <MainStack.Screen
                  name={'AUTH'}
                  component={AuthorizationScreen}
                />
                <AuthStack.Screen name={'ONBOARDING'} component={Board} />

                <MainStack.Screen
                  name={'LANGUAGE'}
                  component={ChangeLanguage}
                />
              </>
            )}
          </MainStack.Navigator>
        </Host>
      </NavigationContainer>
    </MinChatProvider>
  );
};

export default AppNavigator;
