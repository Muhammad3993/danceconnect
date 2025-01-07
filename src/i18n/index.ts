import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ru from './ru.json';
import ch from './ch.json';
import { localStorage } from 'common/libs/local_storage';

export const DEFAULT_LANGUAGE = 'en';

const languageDetector = {
  init: () => {},
  type: 'languageDetector',
  async: true,
  detect: async (callback: (val: string) => void) => {
    const selectedLanguage = await localStorage.getItem('lang');
    return callback(selectedLanguage ?? DEFAULT_LANGUAGE);
  },
  cacheUserLanguage: (lng: string) => {
    localStorage.setItem('lang', lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      中文: { translation: ch }
    },
  });

export default i18n;
