import { safeTarget } from './redirect'

test('keeps a same-origin path', () => {
  expect(safeTarget('/admin/users?page=2')).toBe('/admin/users?page=2')
})

test('falls back to /app when missing', () => {
  expect(safeTarget(undefined)).toBe('/app')
})

test('rejects absolute and protocol-relative URLs', () => {
  expect(safeTarget('https://evil.example')).toBe('/app')
  expect(safeTarget('//evil.example')).toBe('/app')
})

test('rejects backslash tricks', () => {
  expect(safeTarget('/\\evil.example')).toBe('/app')
})
