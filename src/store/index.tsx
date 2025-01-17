import { userApi } from 'data/api/user';
import { User } from 'data/api/user/inerfaces';
import { create } from 'zustand';
import { createSelectors } from './types';
import { DCConstants } from 'data/api/common/interfaces';
import { collectionsApi } from 'data/api/common';
import { sharedStorage } from 'common/libs/shared_storage';

type State = {
  user: User | null;
  constants: DCConstants | null;
};

type Action = {
  initAppAction: () => Promise<void>;
  clearDCStoreAction: (data: { endSession: boolean }) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  updateSubscriptionsCount: (val: number) => void;
  setUser: (user: User) => void;
};

export const DCStore = create<State & Action>((set, get) => ({
  user: null,
  constants: null,
  initAppAction: async () => {
    const user = await userApi.getUser();

    // await DCAmity.loginUser(user.id, user.fullName);

    // const getStreamToken = await userApi.getGetStreamToken();

    // await client.connectUser(
    //   {
    //     id: user.id,
    //     name: extractUserFullName(user),
    //     image: user.photo?.path,
    //     // @ts-ignore
    //     language: user.lang ?? i18n.language,
    //   },
    //   getStreamToken.token,
    // );

    const constants = await collectionsApi.getConstants();

    return set({ user, constants });
  },

  setUser: (user: User) => set({ user }),
  updateUser: user => {
    const currUser = get().user;
    if (currUser) set({ user: { ...currUser, ...user } });
  },

  updateSubscriptionsCount: val => {
    const oldUser = get().user;
    if (oldUser) {
      set({
        user: {
          ...oldUser,
          subscriptionsCount: (oldUser.subscriptionsCount ?? 0) + val,
        },
      });
    }
  },

  // clearDCStoreAction: async () => {
  //   // await DCAmity.logoutUser();

  //   if (auth().currentUser) {
  //     await auth().signOut();
  //   }

  //   await sharedStorage.clearAll();
  //   set({ user: null, constants: null });
  // },
  clearDCStoreAction: async ({ endSession }) => {
    // const pushToken = await sharedStorage.getItem('pushToken');

    if (endSession) {
      // if (pushToken) {
      //   await userApi.unregisterDeviceToken(pushToken);
      // }
      await userApi.logOut();
    }

    // if (client.user) {
    //   await client.disconnectUser();
    //   if (pushToken) {
    //     await client.removeDevice(pushToken, 'firebase');
    //   }
    // }

    // if (pushToken) {
    //   await NotificationsService.removeDeviceToken();
    // }

    await sharedStorage.clearAll();

    set({ user: null });
  },
}));

export const useDCStore = createSelectors(DCStore);
