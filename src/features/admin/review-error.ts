import { parseApiError } from '@/api/errors'

/** 409 means the owner edited the item after the admin loaded it; the page reloads on its own. */
export function reviewErrorMessage(error: unknown): string {
  const { status, message } = parseApiError(error)
  return status === 409
    ? 'Chủ quán vừa sửa nội dung này. Trang đã tải bản mới, hãy xem lại rồi duyệt.'
    : message
}
