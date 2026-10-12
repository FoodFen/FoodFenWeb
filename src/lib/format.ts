const vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
const number = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })

export const formatVnd = (amount: number) => vnd.format(amount)

export const formatNumber = (value: number) => number.format(value)

/** `2026-10-09` to `09/10`. */
export const formatShortDate = (iso: string) => {
  const [, month, day] = iso.split('-')
  return `${day}/${month}`
}

const date = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const formatDate = (iso: string) => date.format(new Date(iso))

const dateTime = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' })

export const formatDateTime = (iso: string) => dateTime.format(new Date(iso))
