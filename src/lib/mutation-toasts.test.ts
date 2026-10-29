import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { toastError, toastSuccess } from './mutation-toasts'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

// The handlers only read `meta` from the mutation.
const mutation = (meta?: object) => ({ meta }) as never

beforeEach(() => vi.clearAllMocks())

test('a success meta shows a translated toast', () => {
  toastSuccess(null, null, null, mutation({ success: 'admin:toast.dishTakenDown' }))
  expect(toast.success).toHaveBeenCalledWith('Đã gỡ món')
})

test('no success meta shows nothing', () => {
  toastSuccess(null, null, null, mutation())
  expect(toast.success).not.toHaveBeenCalled()
})

test('a failure shows the message parsed from the API error', () => {
  const error = new AxiosError('boom', undefined, undefined, undefined, {
    status: 400,
    data: { message: 'Tên đã tồn tại' },
  } as never)
  toastError(error, null, null, mutation())
  expect(toast.error).toHaveBeenCalledWith('Tên đã tồn tại')
})

test('errorToast: false leaves the error to the form', () => {
  toastError(new Error('x'), null, null, mutation({ errorToast: false }))
  expect(toast.error).not.toHaveBeenCalled()
})
