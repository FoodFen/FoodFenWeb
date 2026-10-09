import { AxiosError, type AxiosResponse } from 'axios'
import { parseApiError, shouldRetry } from './errors'

const failure = (status: number, data?: unknown) =>
  new AxiosError('failed', undefined, undefined, undefined, { status, data } as AxiosResponse)

test('uses the message and field errors sent by the BE', () => {
  const result = parseApiError(
    failure(409, { message: 'Email đã tồn tại', errors: { email: 'Email đã được dùng' } }),
  )
  expect(result).toEqual({
    status: 409,
    message: 'Email đã tồn tại',
    fields: { email: 'Email đã được dùng' },
  })
})

test('falls back to a message for the status when the body has none', () => {
  expect(parseApiError(failure(429)).message).toContain('quá nhanh')
})

test('reports a network failure when there was no response', () => {
  expect(parseApiError(new AxiosError('Network Error')).message).toContain('kết nối')
})

test('does not retry client errors but retries server errors twice', () => {
  expect(shouldRetry(0, failure(401))).toBe(false)
  expect(shouldRetry(0, failure(503))).toBe(true)
  expect(shouldRetry(2, failure(503))).toBe(false)
})
