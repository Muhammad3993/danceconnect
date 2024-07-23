import {
  Client,
  API_REGIONS,
  PostRepository,
} from '@amityco/ts-sdk-react-native';
import Config from 'react-native-config';

export const amitySessionHandler: Amity.SessionHandler = {
  sessionWillRenewAccessToken(renewal) {
    renewal.renew();
  },
};

export const DCAmity = {
  init() {
    if (Config.AMITY_API_KEY) {
      Client.createClient(Config.AMITY_API_KEY, API_REGIONS.SG);
      console.log('Amity init');
    }
  },

  loginUser(userId: string, displayName?: string) {
    console.log('user logined to Amity');
    return Client.login({ userId, displayName }, amitySessionHandler);
  },

  logoutUser() {
    console.log('user logout from Amity');
    return Client.logout();
  },

  queryUserPosts({
    userId,
    limit = 5,
    onGetPosts,
  }: {
    userId: string;
    limit?: number;
    onGetPosts: (data: {
      data: Amity.Post[];
      onNextPage?: () => void;
      hasNextPage?: boolean;
      loading?: boolean;
      error?: Error;
    }) => void;
  }) {
    return PostRepository.getPosts(
      { targetId: userId, targetType: 'user', includeDeleted: false, limit },
      onGetPosts,
    );
  },
};
