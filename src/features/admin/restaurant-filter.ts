import type { AdminRestaurantRowResponse } from '@/api/generated'

export const PAGE_SIZE = 20

/** Lower case without diacritics; "đ" has no decomposition, so it is mapped by hand. */
export const normalize = (text: string) =>
  text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/đ/g, 'd')

/** Rows whose name, owner name or owner email contains `query`. */
export function filterRestaurants(rows: AdminRestaurantRowResponse[], query: string) {
  const needle = normalize(query.trim())
  if (!needle) return rows
  return rows.filter((row) =>
    normalize(`${row.name} ${row.ownerName ?? ''} ${row.ownerEmail}`).includes(needle),
  )
}

/** One page of `rows` (1-based). An out-of-range page is clamped to the nearest valid one. */
export function paginate<T>(rows: T[], page: number) {
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(Math.max(1, page), pageCount)
  return {
    items: rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    page: current,
    pageCount,
    total: rows.length,
  }
}
