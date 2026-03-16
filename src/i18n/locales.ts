export const locales = ['en', 'ko', 'ja', 'es', 'de', 'fr', 'ru', 'ar', 'pt', 'it', 'zh', 'tr'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  ru: 'Русский',
  ar: 'العربية',
  pt: 'Português',
  it: 'Italiano',
  zh: '中文',
  tr: 'Türkçe',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  ko: '🇰🇷',
  ja: '🇯🇵',
  es: '🇪🇸',
  de: '🇩🇪',
  fr: '🇫🇷',
  ru: '🇷🇺',
  ar: '🇸🇦',
  pt: '🇵🇹',
  it: '🇮🇹',
  zh: '🇨🇳',
  tr: '🇹🇷',
};

export const defaultLocale: Locale = 'en';
