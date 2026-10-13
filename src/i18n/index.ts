import { storedLanguage } from '@/lib/language'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './resources'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: (typeof resources)['vi']
  }
}

// `lng` comes from storage, so the stored language is applied before the first render.
void i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage(),
  fallbackLng: 'vi',
  defaultNS: 'common',
  ns: Object.keys(resources.vi),
  initAsync: false,
  interpolation: { escapeValue: false },
})

// Keeps <html lang> in step with the language, from the first render on.
document.documentElement.lang = i18n.language
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})

export default i18n
