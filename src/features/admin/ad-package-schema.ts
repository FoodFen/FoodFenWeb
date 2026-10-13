import type { AdPackageResponse, UpdateAdPackageRequest } from '@/api/generated'
import { z } from 'zod'

// Inputs hold strings. Price may be typed "99.000" or "99 000"; days must be plain digits.
const digits = (text: string) => (/^\d+$/.test(text.trim()) ? Number(text.trim()) : NaN)
const money = (text: string) => digits(text.replace(/[.\s]/g, ''))
const positive = (value: number) => Number.isSafeInteger(value) && value > 0

export const adPackageSchema = z.object({
  days: z.string().refine((text) => positive(digits(text)), 'admin:validation.daysPositive'),
  priceVnd: z.string().refine((text) => positive(money(text)), 'admin:validation.pricePositive'),
  active: z.boolean(),
})

export type AdPackageValues = z.infer<typeof adPackageSchema>

/** The form's dirty fields, as react-hook-form reports them. */
export type Dirty = Partial<Record<keyof AdPackageValues, boolean>>

export const emptyAdPackage: AdPackageValues = { days: '', priceVnd: '', active: true }

export const toAdPackageValues = (item: AdPackageResponse): AdPackageValues => ({
  days: String(item.days),
  priceVnd: String(item.priceVnd),
  active: item.active,
})

export const toAdPackageBody = ({ days, priceVnd, active }: AdPackageValues) => ({
  days: digits(days),
  priceVnd: money(priceVnd),
  active,
})

/** PATCH body: only the fields the admin changed. */
export function toAdPackagePatch(values: AdPackageValues, dirty: Dirty): UpdateAdPackageRequest {
  const body: UpdateAdPackageRequest = toAdPackageBody(values)
  return Object.fromEntries(Object.entries(body).filter(([key]) => dirty[key as keyof Dirty]))
}
