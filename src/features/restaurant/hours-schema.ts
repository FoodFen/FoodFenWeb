import { findOverlap, MAX_SHIFTS } from '@/lib/opening-hours'
import { z } from 'zod'

const shift = z.object({ open: z.string(), close: z.string() })

/** Times stay strings (what `<input type="time">` holds); a shift may close after midnight. */
export const hoursSchema = z
  .array(shift)
  .max(MAX_SHIFTS)
  .superRefine((shifts, ctx) => {
    const issue = (path: (string | number)[], key: string) =>
      ctx.addIssue({ code: 'custom', path, message: `restaurant:validation.${key}` })

    shifts.forEach(({ open, close }, i) => {
      if (!open) issue([i, 'open'], 'hoursOpenRequired')
      if (!close) issue([i, 'close'], 'hoursCloseRequired')
      if (open && open === close) issue([i, 'close'], 'hoursSame')
    })
    if (ctx.issues.length > 0) return

    const overlapping = findOverlap(shifts)
    if (overlapping >= 0) issue([overlapping, 'open'], 'hoursOverlap')
  })
