import { isAxiosError } from 'axios'

export type ApiFailure = {
  status?: number
  message: string
  /** Field name (camelCase, as sent by the BE) to its error message. */
  fields: Record<string, string>
}

type ErrorBody = { message?: string; errors?: Record<string, string> }

const byStatus: Record<number, string> = {
  401: 'Phiên đăng nhập không hợp lệ. Hãy đăng nhập lại.',
  403: 'Bạn không có quyền thực hiện thao tác này.',
  404: 'Không tìm thấy dữ liệu yêu cầu.',
  409: 'Dữ liệu đã tồn tại hoặc đang xung đột.',
  422: 'Dữ liệu chưa hợp lệ.',
  429: 'Bạn thao tác quá nhanh. Hãy thử lại sau ít phút.',
}

// Failure bodies from the BE look like { message?, error?, errors?: { field: message } }.
export function parseApiError(error: unknown): ApiFailure {
  if (!isAxiosError<ErrorBody>(error)) {
    return { message: 'Đã có lỗi xảy ra. Hãy thử lại.', fields: {} }
  }
  const { response } = error
  if (!response) {
    return { message: 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.', fields: {} }
  }
  const status = response.status
  return {
    status,
    message:
      response.data?.message ??
      byStatus[status] ??
      (status >= 500 ? 'Máy chủ đang gặp sự cố. Hãy thử lại sau.' : 'Đã có lỗi xảy ra.'),
    fields: response.data?.errors ?? {},
  }
}

// Client errors will not fix themselves on retry; network failures and 5xx might.
export function shouldRetry(failureCount: number, error: unknown) {
  const status = isAxiosError(error) ? error.response?.status : undefined
  return failureCount < 2 && !(status !== undefined && status < 500)
}
