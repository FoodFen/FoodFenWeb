const vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
const number = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })

export const formatVnd = (amount: number) => vnd.format(amount)

export const formatNumber = (value: number) => number.format(value)
