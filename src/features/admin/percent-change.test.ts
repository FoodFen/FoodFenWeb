import { percentChange } from './percent-change'

test('computes the change against yesterday and omits it without a baseline', () => {
  expect(percentChange(115, 100)).toBe(15)
  expect(percentChange(50, 100)).toBe(-50)
  expect(percentChange(5, 0)).toBeUndefined()
})
