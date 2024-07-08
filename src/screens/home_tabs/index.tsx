import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackScreenProps, TabRoutes } from 'screens/interfaces';
import { ProfileScreen } from './profile';
import { HomeScreen } from './home';
import { CommunitiesScreen } from './communities';
import { EventsScreen } from './events';
import { PeopleScreen } from './people';
import { HomeIcon } from 'components/icons/home';
import { CommunitiesIcon } from 'components/icons/communities';
import { TicketIcon } from 'components/icons/ticket';
import { PeopleIcon } from 'components/icons/people';
import { ProfileIcon } from 'components/icons/profile';
import { Image, TouchableOpacity, View } from 'react-native';
import { images } from 'common/resources/images';
import { theming } from 'common/constants/theming';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<TabRoutes>();

export function HomeTabs({ navigation }: StackScreenProps<'homeTabs'>) {
  const { top } = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theming.colors.orange,
        tabBarInactiveTintColor: theming.colors.gray,
      }}>
      <Tab.Screen
        options={{
          tabBarIcon({ focused }) {
            return (
              <HomeIcon
                fill={focused ? theming.colors.orange : theming.colors.white}
                stroke={focused ? theming.colors.orange : theming.colors.gray}
              />
            );
          },
          headerStyle: { height: top + 50 },
          headerTitle: () => null,
          headerLeft(props) {
            return (
              <Image
                resizeMode="contain"
                style={{
                  width: 122,
                  height: 32,
                  marginLeft: theming.spacing.LG,
                }}
                source={images.authLogo}
              />
            );
          },
          headerRight(props) {
            return (
              <TouchableOpacity onPress={() => navigation.navigate('profile')}>
                <View
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: 'red',
                    borderRadius: 20,
                    marginRight: theming.spacing.LG,
                  }}
                />
              </TouchableOpacity>
            );
          },
        }}
        name="home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon({ focused }) {
            return <CommunitiesIcon active={focused} />;
          },
        }}
        name="communities"
        component={CommunitiesScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon(props) {
            return <TicketIcon />;
          },
        }}
        name="events"
        component={EventsScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon(props) {
            return <PeopleIcon />;
          },
        }}
        name="people"
        component={PeopleScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon(props) {
            return <ProfileIcon />;
          },
        }}
        name="profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
