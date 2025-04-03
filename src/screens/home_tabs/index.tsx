/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackScreenProps, TabRoutes } from '@screens/interfaces';
import { ProfileScreen } from './profile';
import { HomeScreen } from './home';
import { CommunitiesScreen } from './communities';
import { EventsScreen } from './events';
import { PeopleScreen } from './people';
import { HomeIcon } from '@components/icons/home';
import { CommunitiesIcon } from '@components/icons/communities';
import { TicketIcon } from '@components/icons/ticket';
import { PeopleIcon } from '@components/icons/people';
import { ProfileIcon } from '@components/icons/profile';
import { useTranslation } from 'react-i18next';
import { useStyles } from 'react-native-unistyles';

const Tab = createBottomTabNavigator<TabRoutes>();

export function HomeTabs({ navigation }: StackScreenProps<'homeTabs'>) {
  const { t } = useTranslation();
  const { theme } = useStyles();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.orange,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarLabelStyle: {
          fontFamily: theme.fonts.latoRegular,
          fontSize: 12,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        options={{
          tabBarIcon({ focused }) {
            return (
              <HomeIcon
                fill={focused ? theme.colors.orange : theme.colors.white}
                stroke={focused ? theme.colors.orange : theme.colors.gray}
              />
            );
          },
          // headerTitle: () => null,
          // headerLeft() {
          //   return (
          //     <Image
          //       resizeMode="contain"
          //       style={{
          //         width: 122,
          //         height: 32,
          //         marginLeft: theme.spacing.LG,
          //       }}
          //       source={images.authLogo}
          //     />
          //   );
          // },
          // headerRight() {
          //   return (
          //     <TouchableOpacity
          //       style={{ marginRight: theme.spacing.MD }}
          //       onPress={() => navigation.navigate('chats')}>
          //       <MessageIcon
          //         fill={theme.colors.orange}
          //         stroke={theme.colors.white}
          //         width={37}
          //         height={37}
          //       />
          //     </TouchableOpacity>
          //   );
          // },
          tabBarLabel: t('home_tab'),
        }}
        name="home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
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
          tabBarIcon({ focused }) {
            return <PeopleIcon focused={focused} />;
          },
          tabBarLabel: t('people_tab'),
        }}
        name="people"
        component={PeopleScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon({ focused }) {
            return <ProfileIcon focused={focused} />;
          },
          tabBarLabel: t('profile_tab'),
        }}
        name="profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
