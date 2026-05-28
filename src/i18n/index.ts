import { createI18n } from 'vue-i18n'
import en from './en.json'
import es from './es.json'

export type Locale = 'en' | 'es'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, es },
})
