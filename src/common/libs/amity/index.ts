import {
  Client,
  API_REGIONS,
  PostRepository,
  ChannelRepository,
  UserRepository,
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

  updateUser(data: { userId: string; displayName: string; photo: string }) {
    return UserRepository.updateUser(data.userId, {
      displayName: data.displayName,
      metadata: { photo: data.photo },
    });
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

  createCommunity(data: { displayName: string; metadata: { photo: string } }) {
    return ChannelRepository.createChannel({ type: 'community', ...data });
  },

  joinCommunity(communityId: string) {
    return ChannelRepository.joinChannel(communityId);
  },

  leaveCommunity(communityId: string) {
    return ChannelRepository.leaveChannel(communityId);
  },
};
