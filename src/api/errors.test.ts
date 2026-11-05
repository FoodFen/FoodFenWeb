import { AxiosError, type AxiosResponse } from 'axios'
import i18n from 'i18next'
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

test('exposes the error code of the body', () => {
  expect(parseApiError(failure(409, { error: 'mascot_id_taken' })).code).toBe('mascot_id_taken')
  expect(parseApiError(failure(409, { message: 'x' })).code).toBeUndefined()
})

test('reads the code and field of a catalog-food 422', () => {
  const result = parseApiError(
    failure(422, { message: 'x', code: 'serving_grams_out_of_range', field: 'servings.1.grams' }),
  )
  expect(result.code).toBe('serving_grams_out_of_range')
  expect(result.field).toBe('servings.1.grams')
})

test('falls back to a message for the status when the body has none', () => {
  expect(parseApiError(failure(429)).message).toContain('quá nhanh')
})

test('fallback messages follow the language', async () => {
  await i18n.changeLanguage('en')
  expect(parseApiError(failure(429)).message).toContain('too fast')
  await i18n.changeLanguage('vi')
})

test('reports a network failure when there was no response', () => {
  expect(parseApiError(new AxiosError('Network Error')).message).toContain('kết nối')
})

test('does not retry client errors but retries server errors twice', () => {
  expect(shouldRetry(0, failure(401))).toBe(false)
  expect(shouldRetry(0, failure(503))).toBe(true)
  expect(shouldRetry(2, failure(503))).toBe(false)
})
