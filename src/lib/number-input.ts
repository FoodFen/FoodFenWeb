/**
 * Number text typed into form inputs. Vietnamese users write "12,5" and "99.000", English ones
 * "12.5" and "99,000", so both separators are read; anything else is NaN.
 */

/** Non-negative decimal: "12,5" and "12.5" are 12.5. */
export function parseDecimal(text: string) {
  const value = text.trim().replace(',', '.')
  return /^\d+(\.\d+)?$/.test(value) ? Number(value) : NaN
}

/** Whole number, optionally grouped by thousands: "99000", "99.000", "99,000" and "99 000" are 99000. */
export function parseWhole(text: string) {
  const value = text.trim()
  if (/^\d+$/.test(value)) return Number(value)
  return /^\d{1,3}([.,\s]\d{3})+$/.test(value) ? Number(value.replace(/[.,\s]/g, '')) : NaN
}
