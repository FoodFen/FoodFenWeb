import type { UpdateUserProfileRequest, UserResponse } from '@/api/generated'
import type { DeepPartial } from 'react-hook-form'
import { z } from 'zod'

export const genderLabels = { male: 'Nam', female: 'Nữ', other: 'Khác' } as const

export const profileSchema = z.object({
  displayName: z.string().trim().max(100, 'Tên tối đa 100 ký tự'),
  gender: z.enum(['', 'male', 'female', 'other']),
  birthYear: z
    .string()
    .trim()
    .refine(
      (v) => v === '' || (/^\d{4}$/.test(v) && +v >= 1900 && +v <= new Date().getFullYear()),
      'Năm sinh không hợp lệ',
    ),
})

export type ProfileValues = z.infer<typeof profileSchema>

export const toProfileValues = (user: UserResponse): ProfileValues => ({
  displayName: user.displayName ?? '',
  gender: user.gender ?? '',
  birthYear: user.birthYear?.toString() ?? '',
})

/** Only changed, non-empty fields: the BE patch cannot clear a field and rejects unknown ones. */
export function toProfilePatch(
  values: ProfileValues,
  dirty: DeepPartial<Record<keyof ProfileValues, boolean>>,
): UpdateUserProfileRequest {
  const patch: UpdateUserProfileRequest = {}
  if (dirty.displayName && values.displayName) patch.displayName = values.displayName
  if (dirty.gender && values.gender) patch.gender = values.gender
  if (dirty.birthYear && values.birthYear) patch.birthYear = Number(values.birthYear)
  return patch
}
