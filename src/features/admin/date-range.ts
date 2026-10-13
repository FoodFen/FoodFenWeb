import { format, parseISO } from 'date-fns'

/** Vietnam calendar days as the BE takes them: `YYYY-MM-DD`. */
export type DateRange = { from: string; to: string }

export const toDate = (iso: string) => parseISO(iso)

export const toIso = (date: Date) => format(date, 'yyyy-MM-dd')

/** Today's date in Vietnam, whatever the browser's time zone. */
export const vietnamToday = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(now)

/**
 * One click of a two-click range pick: the first click only anchors, the second completes the
 * range (in either order). Clicking the same day twice gives a one-day range.
 */
export function pickDay(anchor: string | null, day: string) {
  if (!anchor) return { anchor: day, range: null }
  const [from, to] = anchor <= day ? [anchor, day] : [day, anchor]
  return { anchor: null, range: { from, to } satisfies DateRange }
}
