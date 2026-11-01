import { homePath, safeTarget } from './redirect'

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

test('uses the given fallback instead of /app', () => {
  expect(safeTarget(undefined, '/admin')).toBe('/admin')
  expect(safeTarget('//evil.example', '/admin')).toBe('/admin')
  expect(safeTarget('/admin/users', '/app')).toBe('/admin/users')
})

test('homePath sends admins to /admin and everyone else to /app', () => {
  expect(homePath({ role: 'admin' })).toBe('/admin')
  expect(homePath({ role: 'user' })).toBe('/app')
  expect(homePath(null)).toBe('/app')
})
