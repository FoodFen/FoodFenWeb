import type { PaymentProvider, PaymentStatus, PlanType } from '@/api/generated'
import { z } from 'zod'

export const paymentStatuses = [
  'pending',
  'paid',
  'cancelled',
  'expired',
  'failed',
] as const satisfies readonly PaymentStatus[]
export const planTypes = [
  'monthly',
  'annual',
  'coin_redeem',
  'ad_package',
] as const satisfies readonly PlanType[]
export const paymentProviders = ['payos', 'momo'] as const satisfies readonly PaymentProvider[]

const day = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .catch(undefined)

/** Every filter of the transactions page lives in the URL; an invalid value is dropped. */
export const paymentsSearchSchema = z.object({
  q: z.coerce.string().optional().catch(undefined),
  status: z.enum(paymentStatuses).optional().catch(undefined),
  planType: z.enum(planTypes).optional().catch(undefined),
  provider: z.enum(paymentProviders).optional().catch(undefined),
  from: day,
  to: day,
})
export type PaymentsSearch = z.infer<typeof paymentsSearchSchema>
