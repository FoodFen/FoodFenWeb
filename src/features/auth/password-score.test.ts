import { passwordScore } from './password-score'

test('empty password scores 0', () => {
  expect(passwordScore('')).toBe(0)
})

test('any non-empty password scores at least 1', () => {
  expect(passwordScore('abc')).toBe(1)
})

test('length, mixed case and digit score 3', () => {
  expect(passwordScore('Abcdefg1')).toBe(3)
})

test('adding a symbol reaches the maximum of 4', () => {
  expect(passwordScore('Abcdefg1!')).toBe(4)
})
