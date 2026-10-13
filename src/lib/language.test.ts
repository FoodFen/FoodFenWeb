import i18n from 'i18next'
import { setLanguage, storedLanguage } from './language'

afterEach(() => {
  localStorage.clear()
  return i18n.changeLanguage('vi')
})

test('defaults to Vietnamese and ignores an unknown stored value', () => {
  expect(storedLanguage()).toBe('vi')
  localStorage.setItem('foodfen-lang', 'fr')
  expect(storedLanguage()).toBe('vi')
})

test('setLanguage stores the choice, switches i18n and sets <html lang>', async () => {
  setLanguage('en')
  expect(storedLanguage()).toBe('en')
  await vi.waitFor(() => expect(i18n.language).toBe('en'))
  expect(document.documentElement.lang).toBe('en')
})
