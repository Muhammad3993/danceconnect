import {Dimensions, Platform} from 'react-native';

export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const isAndroid = Platform.OS === 'android';
