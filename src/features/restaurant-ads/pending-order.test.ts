import { clearOrderCode, readOrderCode, saveOrderCode } from './pending-order'

beforeEach(() => {
  sessionStorage.clear()
  history.replaceState(null, '', '/')
})

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

test('the PayOS return URL gives the order, saves it and strips the query', () => {
  history.replaceState(null, '', '/restaurant/ads?code=00&status=PAID&orderCode=55')
  expect(readOrderCode()).toBe(55)
  expect(window.location.search).toBe('')
  expect(window.location.pathname).toBe('/restaurant/ads')
  expect(readOrderCode()).toBe(55)
})

test('the MoMo return URL gives the order from orderId', () => {
  history.replaceState(null, '', '/restaurant/ads?orderId=FF77&resultCode=0&signature=abc')
  expect(readOrderCode()).toBe(77)
  expect(window.location.search).toBe('')
})

test('an orderId that is not ours falls back to storage', () => {
  saveOrderCode(9)
  history.replaceState(null, '', '/restaurant/ads?orderId=xyz')
  expect(readOrderCode()).toBe(9)
  expect(window.location.search).toBe('?orderId=xyz')
})
