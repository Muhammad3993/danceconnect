import Config from 'react-native-config';
import { apiClient } from '../';
import { AuthResponse, AuthUserRequest, User } from './inerfaces';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import { sharedStorage } from '@common/libs/shared_storage';

export const userApi = {
  async loginUser(data: AuthUserRequest) {
    const res = await apiClient.post<AuthResponse>('/auth/email/login', data);
    return res.data;
  },
  async googleLoginUser() {
    try {
      GoogleSignin.configure({
        iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
        webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      });

      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const res = await apiClient.post<AuthResponse>(
          '/auth/google/login',
          response.data,
        );

        // await boostrap(data);
        return res.data;
      } else {
        throw Error('sign in was cancelled by user');
      }
    } catch (error) {
      console.log(error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            throw Error('operation (eg. sign in) already in progress');
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            throw Error('Play services not available or outdated');
          default:
            throw Error('some other error happened');
        }
      } else {
        throw Error("an error that's not related to google sign in occurred");
      }
    }
  },
  async appleLoginUser() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const { identityToken, fullName } = appleAuthRequestResponse;

    const res = await apiClient.post<AuthResponse>('/auth/apple/login', {
      idToken: identityToken,
      firstName: fullName,
    });
    return res.data;
  },
  async registerUser(data: AuthUserRequest) {
    await apiClient.post<void>('/auth/email/register', data);
    const res = await apiClient.post<AuthResponse>('/auth/email/login', data);
    return res.data;
  },
  async editUser(data: Partial<User>) {
    console.log('updating', data);

    const res = await apiClient.patch<User>('/auth/me', data);
    console.log(res.data);

    return res.data;
  },

  async getUser() {
    const token = await sharedStorage.getItem('token');
    if (!token) {
      throw Error('Not Authorized');
    }
    const res = await apiClient.get<User | null>('/auth/me');
    const user = res.data;

    if (!user) {
      throw Error('User not found');
    }

    return user;
  },

  async getGetStreamToken() {
    const res = await apiClient.get<{ token: string }>('/users/getStreamToken');
    return res.data;
  },

  async getUserById(id: string) {
    const res = await apiClient.get<User>(`/users/${id}`);
    return res.data;
  },

  async logOut() {
    const res = await apiClient.post('/auth/logout', undefined, {
      params: { withAuth: false },
    });
    return res.data;
  },

  async deleteUserAcc() {
    const res = await apiClient.post('/users/deactivate');
    return res.data;
  },

  async forgetPasword(email: string) {
    const res = await apiClient.post('/auth/forgot/password', { email });
    return res.data;
  },
  async resetPasword(data: { password: string; hash: string }) {
    const res = await apiClient.post('/auth/reset/password', data);
    return res.data;
  },

  async changePasword(data: { oldPassword: string; newPassword: string }) {
    const res = await apiClient.post('/auth/change/password', data);
    return res.data;
  },

  async subscribeForUser(id: string) {
    const res = await apiClient.post(`/users/subscribe/${id}`);
    return res;
  },
  async unsubscribeForUser(id: string) {
    const res = await apiClient.post(`/users/unsubscribe/${id}`);
    return res;
  },
  async getAllSubscribers(userId: string) {
    const res = await apiClient.get<User[]>(`/users/subscribers/${userId}`);
    return res.data;
  },
  async getAllSubscriptions(userId: string) {
    const res = await apiClient.get<User[]>(`/users/subscriptions/${userId}`);
    return res.data;
  },
  async registerDeviceToken(token: string) {
    await apiClient.post(`/users/deviceToken/add/${token}`);
  },
  async unregisterDeviceToken(token: string) {
    await apiClient.post(`/users/deviceToken/remove/${token}`);
  },

  // listenUserEvents({
  //   userId,
  //   onUserBan,
  //   onUserDeleted,
  //   onUserActivated,
  // }: {
  //   userId: string;
  //   onUserBan: () => void;
  //   onUserDeleted: () => void;
  //   onUserActivated: () => void;
  // }) {
  //   const socket = io(`${Config.BASE_URL}?userId=${userId}`);

  //   socket.on('connect', () => {
  //     socket.on('banned', onUserBan);
  //     socket.on('deleted', onUserDeleted);
  //     socket.on('activated', onUserActivated);
  //   });

  //   const dispose = () => socket.close();
  //   return dispose;
  // },
};
