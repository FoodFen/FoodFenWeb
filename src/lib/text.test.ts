import { fold } from './text'

test('strips diacritics and lowercases', () => {
  expect(fold('Phạm Gia Bảo')).toBe('pham gia bao')
})

test('maps đ to d', () => {
  expect(fold('Đặng Đức')).toBe('dang duc')
})

test('leaves plain ascii alone', () => {
  expect(fold('minh@example.com')).toBe('minh@example.com')
})
