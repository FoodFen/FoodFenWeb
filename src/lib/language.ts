import i18n from 'i18next'

export const LANGUAGES = ['vi', 'en'] as const

export type Language = (typeof LANGUAGES)[number]

// The choice is stored only after the user toggles; until then Vietnamese is the default.
const key = 'foodfen-lang'

export function storedLanguage(): Language {
  try {
    const value = localStorage.getItem(key)
    return LANGUAGES.find((lang) => lang === value) ?? 'vi'
  } catch {
    return 'vi'
  }
}

export function setLanguage(lang: Language) {
  try {
    localStorage.setItem(key, lang)
  } catch {
    // Storage can be blocked; the language still applies for this visit.
  }
  void i18n.changeLanguage(lang)
}
