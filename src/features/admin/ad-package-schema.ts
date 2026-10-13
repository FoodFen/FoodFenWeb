import type { AdPackageResponse, UpdateAdPackageRequest } from '@/api/generated'
import { parseWhole } from '@/lib/number-input'
import { z } from 'zod'

// Inputs hold strings; the price may be typed "99.000", "99,000" or "99 000".
// Limits mirror the BE's CreateAdPackageRequest: days 1 to 3650, price 1 to 999 999 999 999.
const whole = (message: string, max: number) =>
  z.string().refine((text) => {
    const value = parseWhole(text)
    return value >= 1 && value <= max
  }, message)

export const adPackageSchema = z.object({
  days: whole('admin:validation.daysRange', 3650),
  priceVnd: whole('admin:validation.priceRange', 999_999_999_999),
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
  days: parseWhole(days),
  priceVnd: parseWhole(priceVnd),
  active,
})

/** PATCH body: only the fields the admin changed. */
export function toAdPackagePatch(values: AdPackageValues, dirty: Dirty): UpdateAdPackageRequest {
  const body: UpdateAdPackageRequest = toAdPackageBody(values)
  return Object.fromEntries(Object.entries(body).filter(([key]) => dirty[key as keyof Dirty]))
}
