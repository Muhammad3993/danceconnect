import React, { useLayoutEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackRoutes } from './interfaces';
import { RegisterScreen } from './auth/registration';
import { LoginScreen } from './auth/login';
import { AuthScreen } from './auth';
import { useDCStore } from 'store';
import { isEmptyArray } from 'common/utils/array';
import { EditUserScreen } from './auth/edit_user';
import { Platform, UIManager } from 'react-native';
import { HomeTabs } from './home_tabs';
import { EditProfileScreen } from './edit_profile';
import { EventScreen } from './event';

const Stack = createNativeStackNavigator<RootStackRoutes>();

export function Navigation() {
  const user = useDCStore.use.user();
  // const initAppAction = useDCStore.use.initAppAction();

  useLayoutEffect(() => {
    // initAppAction();
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

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
