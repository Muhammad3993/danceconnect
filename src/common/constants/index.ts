import i18n from 'i18n';
import { Dimensions } from 'react-native';

const screenSize = Dimensions.get('screen');

export const SCREEN_HEIGHT = screenSize.height;
export const SCREEN_WIDTH = screenSize.width;

export const genders = [
  { id: 1, title: i18n.t('gender_select.male') },
  { id: 2, title: i18n.t('gender_select.female') },
  { id: 3, title: i18n.t('gender_select.nonbinary') },
];

export const roles = [
  { id: 0, title: i18n.t('role_dance') },
  { id: 1, title: i18n.t('role_teacher') },
  { id: 2, title: i18n.t('role_organizer') },
];
