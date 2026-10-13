export type Shift = { open: string; close: string }

export const MAX_SHIFTS = 3

const DAY = 24 * 60
const TIME = String.raw`(\d{1,2})(?:[:hH](\d{2})?)?`
const SHIFT = new RegExp(String.raw`^\s*${TIME}\s*[-–—]\s*${TIME}\s*$`)

/** Stored text, same shape the mobile app shows: "07:00-10:30, 16:00-21:00". */
export const formatHours = (shifts: Shift[]) =>
  shifts.map(({ open, close }) => `${open}-${close}`).join(', ')

function toTime(hours = '', minutes = '00') {
  const h = Number(hours)
  const m = Number(minutes)
  if (h > 23 || m > 59) return null
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Reads what formatHours writes and older free text ("7:00 - 21:00", "7h-21h"); null if unreadable. */
export function parseHours(text: string): Shift[] | null {
  const parts = text.split(/[,;]/)
  if (parts.length > MAX_SHIFTS) return null
  const shifts: Shift[] = []
  for (const part of parts) {
    const match = SHIFT.exec(part)
    if (!match) return null
    const open = toTime(match[1], match[2])
    const close = toTime(match[3], match[4])
    if (!open || !close) return null
    shifts.push({ open, close })
  }
  return shifts
}

const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))

export const crossesMidnight = ({ open, close }: Shift) => minutes(close) < minutes(open)

/** Start and end in minutes; a shift that crosses midnight ends on the next day. */
function span({ open, close }: Shift) {
  const start = minutes(open)
  const end = minutes(close)
  return [start, end < start ? end + DAY : end] as const
}

function overlap(a: Shift, b: Shift) {
  const [aStart, aEnd] = span(a)
  const [bStart, bEnd] = span(b)
  // A shift past midnight also meets the other one's morning hours, so compare across days.
  return [-DAY, 0, DAY].some((day) => aStart < bEnd + day && bStart + day < aEnd)
}

/** Index of the first shift that overlaps an earlier one, or -1. */
export const findOverlap = (shifts: Shift[]) =>
  shifts.findIndex((shift, i) => shifts.slice(0, i).some((earlier) => overlap(earlier, shift)))
