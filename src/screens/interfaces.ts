import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Community } from 'data/api/community/interfaces';

export type RootStackRoutes = {
  // auth
  auth: undefined;
  register: undefined;
  login: undefined;
  editUser: undefined;

  // home
  homeTabs: undefined;
  editProfile: undefined;
  editDanceStyles: undefined;
  event: undefined;
  createCommunity: { community?: Community };
  community: { id: string };
  createEvent: undefined;
  createTicket: undefined;
  chats: undefined;
  chat: { channelId: string };
  createPost: {
    targetId: string;
    targetType: 'community' | 'user';
    postId?: string;
    postText?: string;
    file?: Amity.File<'image' | 'video'>;
  };
};

export type TabRoutes = {
  home: undefined;
  communities: undefined;
  events: undefined;
  people: undefined;
  profile: undefined;
};

export type StackScreenProps<Route extends keyof RootStackRoutes> =
  NativeStackScreenProps<RootStackRoutes, Route>;

export type StackScreenNavigation<Route extends keyof RootStackRoutes> =
  NativeStackNavigationProp<RootStackRoutes, Route>;

export type TabScreenProps<Route extends keyof TabRoutes> =
  CompositeScreenProps<
    BottomTabScreenProps<TabRoutes, Route>,
    StackScreenProps<'homeTabs'>
  >;
export type TabScreenNavigation<Route extends keyof TabRoutes> =
  CompositeNavigationProp<
    BottomTabNavigationProp<TabRoutes, Route>,
    StackScreenNavigation<'homeTabs'>
  >;
