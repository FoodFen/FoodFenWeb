import { rejectSchema } from './reject-schema'

test('a reason is required, trimmed and at most 1000 characters', () => {
  expect(rejectSchema.safeParse({ reason: '   ' }).success).toBe(false)
  expect(rejectSchema.parse({ reason: ' Thiếu ảnh ' })).toEqual({ reason: 'Thiếu ảnh' })
  expect(rejectSchema.safeParse({ reason: 'a'.repeat(1001) }).success).toBe(false)
  expect(rejectSchema.safeParse({ reason: 'a'.repeat(1000) }).success).toBe(true)
})
