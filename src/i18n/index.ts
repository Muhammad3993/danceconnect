import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ru from './ru.json';
import ch from './ch.json';

export const DEFAULT_LANGUAGE = 'en';

i18n.use(initReactI18next).init({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: i18n.language,
  compatibilityJSON: 'v3',
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
