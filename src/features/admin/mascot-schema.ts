import type { AdminMascotResponse, UpdateMascotRequest } from '@/api/generated'
import { HAND_DRAWN_IDS, MASCOT_STATES } from './mascot-states'
import { parseWhole } from '@/lib/number-input'
import { z } from 'zod'

const coinCostInRange = (text: string) => {
  const value = parseWhole(text)
  return value >= 0 && value <= 1_000_000
}

const nameLength = 'admin:mascots.validation.nameLength'

// Limits mirror the BE: id slug of 1 to 32, name 1 to 40, price 0 to 1 000 000.
export const mascotSchema = z.object({
  id: z.string().regex(/^[a-z0-9_-]{1,32}$/, 'admin:mascots.validation.idFormat'),
  name: z.string().trim().min(1, nameLength).max(40, nameLength),
  coinCost: z.string().refine(coinCostInRange, 'admin:mascots.validation.coinCostRange'),
  images: z.partialRecord(z.enum(MASCOT_STATES), z.string()),
  bodyColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'admin:mascots.validation.bodyColor')
    .nullable(),
})

export type MascotValues = z.infer<typeof mascotSchema>

/** The form's dirty fields, as react-hook-form reports them. */
export type Dirty = Partial<Record<'name' | 'coinCost' | 'bodyColor', boolean>>

export const emptyMascot: MascotValues = {
  id: '',
  name: '',
  coinCost: '0',
  images: {},
  bodyColor: null,
}

export const toMascotValues = (item: AdminMascotResponse): MascotValues => ({
  id: item.id,
  name: item.name,
  coinCost: String(item.coinCost),
  images: item.images,
  bodyColor: item.bodyColor,
})

/** "Cà Chua Đỏ!" becomes "ca-chua-do": the id suggested from the name. */
export const slugify = (name: string) =>
  name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32)
    .replace(/-+$/, '')

/** New mascots are drafts: the admin shows them from the table once they look right. */
export const toMascotBody = ({ id, name, coinCost, images, bodyColor }: MascotValues) => ({
  id,
  name: name.trim(),
  coinCost: parseWhole(coinCost),
  active: false,
  images,
  bodyColor,
})

/** Per state: the new url, or `null` for an image that was removed. Unchanged states are left out. */
function imageDiff(current: MascotValues['images'], original: MascotValues['images']) {
  const diff: NonNullable<UpdateMascotRequest['images']> = {}
  for (const state of MASCOT_STATES) {
    if (current[state] !== original[state]) diff[state] = current[state] ?? null
  }
  return diff
}

/** PATCH body: only the changed name, price and body color, and the images that differ from the saved ones. */
export function toMascotPatch(
  values: MascotValues,
  dirty: Dirty,
  originalImages: MascotValues['images'],
): UpdateMascotRequest {
  const patch: UpdateMascotRequest = {}
  if (dirty.name) patch.name = values.name.trim()
  if (dirty.coinCost) patch.coinCost = parseWhole(values.coinCost)
  if (dirty.bodyColor) patch.bodyColor = values.bodyColor
  const images = imageDiff(values.images, originalImages)
  if (Object.keys(images).length > 0) patch.images = images
  return patch
}

/** Why the "shown" switch cannot be turned on, or null when it can be. */
export function activeLock(mascot: AdminMascotResponse) {
  if (mascot.id === 'default') return 'default'
  const needsIdle = !mascot.active && !mascot.images.idle && !HAND_DRAWN_IDS.includes(mascot.id)
  return needsIdle ? 'noIdle' : null
}
