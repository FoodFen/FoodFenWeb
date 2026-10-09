import { AxiosError, type AxiosResponse } from 'axios'
import { reviewErrorMessage } from './review-error'

const failure = (status: number, data?: unknown) =>
  new AxiosError('failed', undefined, undefined, undefined, { status, data } as AxiosResponse)

test('explains a 409 as the owner having edited the item', () => {
  const message = reviewErrorMessage(failure(409, { message: 'changed since you loaded it' }))
  expect(message).toContain('Chủ quán vừa sửa')
})

test('passes other errors through parseApiError', () => {
  expect(reviewErrorMessage(failure(400, { message: 'Cần lý do' }))).toBe('Cần lý do')
})
