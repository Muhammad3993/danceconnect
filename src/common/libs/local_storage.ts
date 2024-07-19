import AsyncStorage from '@react-native-async-storage/async-storage';

export const localStorage = {
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
  removeItem: AsyncStorage.removeItem,
  clearAll: AsyncStorage.clear,
};
