import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import da from '@/locales/da.json';
import en from '@/locales/en.json';
import is from '@/locales/is.json';

export const SUPPORTED_LANGUAGES = ['da', 'en', 'is'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const FALLBACK_LANGUAGE: Language = 'en';

function isSupported(code: string | null | undefined): code is Language {
  return SUPPORTED_LANGUAGES.some((lang) => lang === code);
}

/** The first of the device's preferred languages that Weven supports, else English. */
export function deviceLanguage(): Language {
  const match = getLocales()
    .map((locale) => locale.languageCode)
    .find(isSupported);
  return match ?? FALLBACK_LANGUAGE;
}

void i18n.use(initReactI18next).init({
  resources: {
    da: { translation: da },
    en: { translation: en },
    is: { translation: is },
  },
  lng: deviceLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: { escapeValue: false }, // React already escapes
  returnNull: false,
});

export default i18n;
