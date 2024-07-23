import { userApi } from 'data/api/user';
import { User } from 'data/api/user/inerfaces';
import { create } from 'zustand';
import { createSelectors } from './types';
import { DCConstants } from 'data/api/collections/interfaces';
import { collectionsApi } from 'data/api/collections';
import { DCAmity } from 'common/libs/amity';
import auth from '@react-native-firebase/auth';

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
    await DCAmity.loginUser(user.id, user.userName);

    const constants = await collectionsApi.getConstants();

    return set({ user, constants });
  },

  setUser: (user: User) => set({ user }),
  clearDCStoreAction: async () => {
    await DCAmity.logoutUser();
    await auth().signOut();
    set({ user: null, constants: null });
  },
}));

export const useDCStore = createSelectors(DCStore);
