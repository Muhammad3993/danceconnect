import React, { useEffect, useLayoutEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackRoutes } from './interfaces';
import { RegisterScreen } from './auth/registration';
import { LoginScreen } from './auth/login';
import { AuthScreen } from './auth';
import { useDCStore } from 'store';
import { isEmptyArray } from 'common/utils/array';
import { EditUserScreen } from './auth/onboarding';
import { Platform, UIManager } from 'react-native';
import { HomeTabs } from './home_tabs';
import { EditProfileScreen } from './edit_profile';
import { EventScreen } from './event';
import { CreateCommunity } from './create_community';
import { ChatsScreen } from './chats';
import { CommunityScreen } from './community';
import { CreateEvent } from './create_event';
import CreateTicket from './create_ticket';
import { LoaderView } from 'components/shared/loader_view';
import { useTranslation } from 'react-i18next';
import { NavigationBackIcon } from './ui/BackIcon';
import { ChatScreen2 } from './stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-react-native';
import { client } from 'common/libs/strem-chat';

const Stack = createNativeStackNavigator<RootStackRoutes>();

export function Navigation() {
  const initApp = useDCStore.use.initAppAction();
  const { t } = useTranslation();
  const user = useDCStore.use.user();
  const [initing, setIniting] = useState(true);

  useEffect(() => {
    initApp().finally(() => setIniting(false));
  }, [initApp]);

  useLayoutEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  const isEmptyUser =
    user !== null &&
    isEmptyArray(user.individualStyles) &&
    isEmptyArray(user.userRole);

  if (initing) {
    return <LoaderView />;
  }

  return (
    <OverlayProvider>
      <Chat client={client}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              headerLeft: () => <NavigationBackIcon />,
            }}>
            {user == null ? (
              <>
                <Stack.Screen name="auth" component={AuthScreen} />
                <Stack.Screen name="register" component={RegisterScreen} />
                <Stack.Screen name="login" component={LoginScreen} />
              </>
            ) : isEmptyUser ? (
              <Stack.Screen name="editUser" component={EditUserScreen} />
            ) : (
              <>
                <Stack.Screen name="homeTabs" component={HomeTabs} />
                <Stack.Screen
                  name="editProfile"
                  component={EditProfileScreen}
                />
                <Stack.Screen name="event" component={EventScreen} />
                <Stack.Screen
                  options={{
                    headerShown: true,
                    headerTitle: t('create_community_card_title'),
                    headerTitleAlign: 'center',
                  }}
                  name="createCommunity"
                  component={CreateCommunity}
                />
                <Stack.Screen name="community" component={CommunityScreen} />

                <Stack.Screen name="createEvent" component={CreateEvent} />
                <Stack.Screen name="createTicket" component={CreateTicket} />
                <Stack.Screen name="chats" component={ChatsScreen} />
                {/* <Stack.Screen
              name="chat"
              component={ChatScreen}
              options={{
                headerShown: true,
                headerTitle: t('create_community_card_title'),
                headerTitleAlign: 'center',
              }}
            /> */}

                <Stack.Screen
                  name="chat"
                  component={ChatScreen2}
                  options={{
                    headerShown: true,
                    headerTitle: t('create_community_card_title'),
                    headerTitleAlign: 'center',
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </Chat>
    </OverlayProvider>
  );
}
