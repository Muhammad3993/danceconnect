import { userApi } from 'data/api/user';
import { User } from 'data/api/user/inerfaces';
import { create } from 'zustand';
import { createSelectors } from './types';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localstorage } from 'common/libs/mmkv';
import { DCConstants } from 'data/api/collections/interfaces';
import { collectionsApi } from 'data/api/collections';

type State = {
  user: User | null;
  constants: DCConstants | null;
};

type Action = {
  initAppAction: () => Promise<void>;
  clearDCStoreAction: () => void;
  setUser: (user: User) => void;
};

export const DCStore = create<State & Action>()(
  persist(
    set => ({
      user: null,
      constants: null,
      initAppAction: async () => {
        const user = await userApi.getUser();
        const constants = await collectionsApi.getConstants();

        return set({ user, constants });
      },

      setUser: (user: User) => set({ user }),
      clearDCStoreAction: () => set({ user: null, constants: null }),
    }),
    {
      name: 'DC-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localstorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export const useDCStore = createSelectors(DCStore);
