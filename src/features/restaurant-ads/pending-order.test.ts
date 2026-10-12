import { clearOrderCode, readOrderCode, saveOrderCode } from './pending-order'

beforeEach(() => sessionStorage.clear())

test('the saved order code round-trips and clears', () => {
  expect(readOrderCode()).toBeNull()
  saveOrderCode(1234)
  expect(readOrderCode()).toBe(1234)
  clearOrderCode()
  expect(readOrderCode()).toBeNull()
})

test('a garbage value reads as no order', () => {
  sessionStorage.setItem('foodfen-ad-order', 'abc')
  expect(readOrderCode()).toBeNull()
})
