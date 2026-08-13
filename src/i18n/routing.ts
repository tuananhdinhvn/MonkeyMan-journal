import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['vi', 'en', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'never',
});
