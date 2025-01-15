import AsyncStorage from '@react-native-async-storage/async-storage';

export const sharedStorage = {
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
  removeItem: AsyncStorage.removeItem,
  clearAll: AsyncStorage.clear,
};
