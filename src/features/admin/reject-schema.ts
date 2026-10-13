import { z } from 'zod'

// The BE requires a reason to reject and takes at most 1000 characters (ReviewRequest).
export const rejectSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, 'admin:rejectDialog.reasonRequired')
    .max(1000, 'admin:validation.reasonMax'),
})

export type RejectValues = z.infer<typeof rejectSchema>
