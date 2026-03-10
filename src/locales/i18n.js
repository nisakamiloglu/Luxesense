import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './en.json';
import tr from './tr.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
};

// Cihazın dilini al
let defaultLanguage = 'en';
try {
  const locales = getLocales();
  if (locales && locales.length > 0) {
    const deviceLang = locales[0].languageCode;
    if (deviceLang === 'tr') {
      defaultLanguage = 'tr';
    }
  }
} catch (e) {
  defaultLanguage = 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
