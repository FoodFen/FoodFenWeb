import { formatPhone, isValidPhone, phoneHref, toStoredPhone } from './phone'

test.each(['0901 234 567', '0901234567', '+84 901 234 567', '028 3822 1234', '+1 415 555 2671'])(
  'accepts %s',
  (text) => expect(isValidPhone(text)).toBe(true),
)

test.each(['', 'abc', '123', '090123456'])('rejects "%s"', (text) =>
  expect(isValidPhone(text)).toBe(false),
)

test('Vietnamese numbers are stored nationally without spaces, whatever way they were typed', () => {
  expect(toStoredPhone('0901 234 567')).toBe('0901234567')
  expect(toStoredPhone('+84 901 234 567')).toBe('0901234567')
  expect(toStoredPhone('028 3822 1234')).toBe('02838221234')
})

test('foreign numbers are stored as E.164', () => {
  expect(toStoredPhone('+1 415 555 2671')).toBe('+14155552671')
})

test('display groups the digits; an unreadable legacy value is shown as stored', () => {
  expect(formatPhone('0901234567')).toBe('0901 234 567')
  expect(formatPhone('+14155552671')).toBe('+1 415 555 2671')
  expect(formatPhone('gọi quán')).toBe('gọi quán')
})

test('the tel link keeps digits and a leading plus', () => {
  expect(phoneHref('0901 234 567')).toBe('tel:0901234567')
  expect(phoneHref('+1 415 555 2671')).toBe('tel:+14155552671')
})
