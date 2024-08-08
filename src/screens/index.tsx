import React, { useEffect, useLayoutEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackRoutes } from './interfaces';
import { RegisterScreen } from './auth/registration';
import { LoginScreen } from './auth/login';
import { AuthScreen } from './auth';
import { useDCStore } from 'store';
import { isEmptyArray } from 'common/utils/array';
import { EditUserScreen } from './auth/edit_user';
import { ActivityIndicator, Platform, UIManager, View } from 'react-native';
import { HomeTabs } from './home_tabs';
import { EditProfileScreen } from './edit_profile';
import { EventScreen } from './event';
import { CreateCommunity } from './create_community';
import { Messages } from './messages';
import { CommunityScreen } from './community';
import { CreateEvent } from './create_event';
import CreateTicket from './create_ticket';
import { Message } from './messages/ui/Message';

const Stack = createNativeStackNavigator<RootStackRoutes>();

export function Navigation() {
  const initApp = useDCStore.use.initAppAction();
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
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="message" component={Message} />
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
            <Stack.Screen name="editProfile" component={EditProfileScreen} />
            <Stack.Screen name="event" component={EventScreen} />
            <Stack.Screen name="createCommunity" component={CreateCommunity} />
            <Stack.Screen name="messages" component={Messages} />
            <Stack.Screen name="community" component={CommunityScreen} />
            <Stack.Screen name="createEvent" component={CreateEvent} />
            <Stack.Screen name="createTicket" component={CreateTicket} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
