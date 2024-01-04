import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import ru from './ru.json';
import ch from './ch.json';
import {DEFAULT_LANGUAGE} from '../utils/lg_constants';

i18n.use(initReactI18next).init({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: i18n.language,
  resources: {
    ru: {
      translation: ru,
    },
    en: {
      translation: en,
    },
    中文: {
      translation: ch,
    },
  },
});

export default i18n;
