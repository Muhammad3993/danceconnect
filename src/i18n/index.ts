import i18n, { ModuleType } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ru from './ru.json';
import ch from './ch.json';
import { sharedStorage } from 'common/libs/shared_storage';
// import { getLocales } from 'react-native-localize';

export const DEFAULT_LANGUAGE = 'en';

const languageDetector = {
  init: () => {},
  type: 'languageDetector' as ModuleType,
  async: true,
  detect: async (callback: (val: string) => void) => {
    const selectedLanguage = await sharedStorage.getItem('lang');

    // const locales = getLocales() ?? [];

    // const def =
    //   locales.length > 0
    //     ? locales[0].languageCode.substring(0, 2).toLowerCase()
    //     : DEFAULT_LANGUAGE;
    const res = selectedLanguage ?? DEFAULT_LANGUAGE;

    return callback(res);
  },
  cacheUserLanguage: (lng: string) => {
    sharedStorage.setItem('lang', lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    debug: __DEV__,
    compatibilityJSON: 'v4',
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      中文: { translation: ch },
    },
  });

export default i18n;
