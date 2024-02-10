import { I18n } from 'i18n-js';
import { en, sv, tr } from './assets/locales';

const i18n = new I18n();

i18n.store(en);
i18n.store(sv);
i18n.store(tr);

i18n.defaultLocale = 'en';

// async function loadTranslations(i18n, locale) {
//   const response = await fetch(`./assets/locales/${locale}/translation.json`);
//   const translations = await response.json();
//   console.log('tr: ', translations);
//   i18n.store(translations);
// }

// loadTranslations(i18n, 'en');

const locales = [
  {
    value: 'en',
    label: 'English',
  },
  { value: 'sv', label: 'Svenska' },
  { value: 'tr', label: 'Türkçe' },
];

export { i18n, locales };
