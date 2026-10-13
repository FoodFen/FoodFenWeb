import { forgotSchema, loginSchema, registerSchema, resetSchema } from './schemas'

test('reset password follows the 8..72 character rule', () => {
  expect(resetSchema.safeParse({ newPassword: 'short' }).success).toBe(false)
  expect(resetSchema.safeParse({ newPassword: 'a'.repeat(73) }).success).toBe(false)
  expect(resetSchema.safeParse({ newPassword: 'longenough' }).success).toBe(true)
})

test('an email is trimmed, must be valid and at most 320 characters', () => {
  expect(forgotSchema.parse({ email: ' a@b.vn ' })).toEqual({ email: 'a@b.vn' })
  expect(forgotSchema.safeParse({ email: 'not-an-email' }).success).toBe(false)
  expect(forgotSchema.safeParse({ email: `${'a'.repeat(320)}@b.vn` }).success).toBe(false)
})

test('sign-in takes 1 to 72 password characters, sign-up takes 8 to 72', () => {
  const email = 'a@b.vn'
  expect(loginSchema.safeParse({ email, password: '' }).success).toBe(false)
  expect(loginSchema.safeParse({ email, password: 'a'.repeat(73) }).success).toBe(false)
  expect(loginSchema.safeParse({ email, password: 'x' }).success).toBe(true)
  expect(registerSchema.safeParse({ email, password: 'short' }).success).toBe(false)
  expect(registerSchema.safeParse({ email, password: 'a'.repeat(100) }).success).toBe(false)
})

test('a display name is at most 100 characters', () => {
  const base = { email: 'a@b.vn', password: 'longenough' }
  expect(registerSchema.safeParse({ ...base, displayName: 'a'.repeat(101) }).success).toBe(false)
  expect(registerSchema.safeParse({ ...base, displayName: '' }).success).toBe(true)
})
