import { userApi } from 'data/api/user';
import { User } from 'data/api/user/inerfaces';
import { create } from 'zustand';
import { createSelectors } from './types';
import { DCConstants } from 'data/api/collections/interfaces';
import { collectionsApi } from 'data/api/collections';
import auth from '@react-native-firebase/auth';
import { localStorage } from 'common/libs/local_storage';
import { client } from 'common/libs/strem-chat';
import { getImgePath } from 'data/api';

type State = {
  user: User | null;
  constants: DCConstants | null;
};

type Action = {
  initAppAction: () => Promise<void>;
  clearDCStoreAction: () => Promise<void>;
  setUser: (user: User) => void;
};

export const DCStore = create<State & Action>(set => ({
  user: null,
  constants: null,
  initAppAction: async () => {
    const user = await userApi.getUser();

    await client.connectUser(
      {
        id: user.id,
        name: user.userName,
        image: getImgePath(user.userImage),
      },
      client.devToken(user.id),
    );

    const constants = await collectionsApi.getConstants();

    return set({ user, constants });
  },

  setUser: (user: User) => set({ user }),

  clearDCStoreAction: async () => {
    await client.disconnectUser();
    if (auth().currentUser) {
      await auth().signOut();
    }
    await localStorage.clearAll();
    set({ user: null, constants: null });
  },
}));

export const useDCStore = createSelectors(DCStore);
