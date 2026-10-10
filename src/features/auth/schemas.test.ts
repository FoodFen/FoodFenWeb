import { resetSchema } from './schemas'

test('reset password follows the 8..72 character rule', () => {
  expect(resetSchema.safeParse({ newPassword: 'short' }).success).toBe(false)
  expect(resetSchema.safeParse({ newPassword: 'a'.repeat(73) }).success).toBe(false)
  expect(resetSchema.safeParse({ newPassword: 'longenough' }).success).toBe(true)
})
