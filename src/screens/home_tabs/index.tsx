/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
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
import { MessageIcon } from 'components/icons/message';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator<TabRoutes>();

export function HomeTabs({ navigation }: StackScreenProps<'homeTabs'>) {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theming.colors.orange,
        tabBarInactiveTintColor: theming.colors.gray,
        tabBarLabelStyle: {
          fontFamily: theming.fonts.latoRegular,
          fontSize: 12,
        },
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
          headerTitle: () => null,
          headerLeft() {
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
          headerRight() {
            return (
              <TouchableOpacity
                style={{ marginRight: theming.spacing.MD }}
                onPress={() => navigation.navigate('chats')}>
                <MessageIcon
                  fill={theming.colors.orange}
                  stroke={theming.colors.white}
                  width={37}
                  height={37}
                />
              </TouchableOpacity>
            );
          },
          tabBarLabel: t('home_tab'),
        }}
        name="home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon({ focused }) {
            return <CommunitiesIcon active={focused} />;
          },
          tabBarLabel: t('communities_tab'),
        }}
        name="communities"
        component={CommunitiesScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return <TicketIcon active={props.focused} />;
          },
          tabBarLabel: t('events_tab'),
        }}
        name="events"
        component={EventsScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return <PeopleIcon />;
          },
          tabBarLabel: t('people_tab'),
        }}
        name="people"
        component={PeopleScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return <ProfileIcon />;
          },
          tabBarLabel: t('profile_tab'),
        }}
        name="profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
