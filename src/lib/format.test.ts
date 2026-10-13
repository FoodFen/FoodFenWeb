import i18n from 'i18next'
import { formatNumber, formatShortDate, formatVnd } from './format'

afterEach(() => i18n.changeLanguage('vi'))

test('formats follow the current language', async () => {
  expect(formatShortDate('2026-10-09')).toBe('09/10')
  expect(formatNumber(1234.5)).toBe('1.234,5')

  await i18n.changeLanguage('en')
  expect(formatShortDate('2026-10-09')).toBe('10/09')
  expect(formatNumber(1234.5)).toBe('1,234.5')
})

test('VND is the grouped number followed by the dong sign in both languages', async () => {
  expect(formatVnd(99000)).toBe('99.000 ₫')
  await i18n.changeLanguage('en')
  expect(formatVnd(99000)).toBe('99,000 ₫')
})
