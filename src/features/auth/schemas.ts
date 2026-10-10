import { z } from 'zod'

const email = z.email('Email không hợp lệ')
const password = z
  .string()
  .min(8, 'Mật khẩu cần ít nhất 8 ký tự')
  .max(72, 'Mật khẩu tối đa 72 ký tự')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Nhập mật khẩu'),
})

export const registerSchema = z.object({
  displayName: z.string().trim().max(100, 'Tên tối đa 100 ký tự').optional(),
  email,
  password,
})

export const forgotSchema = z.object({ email })

export const resetSchema = z.object({ newPassword: password })

/** Search params of the pages the BE's emails link to (`?token=`). */
export const tokenSearch = z.object({ token: z.string().optional().catch(undefined) })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type ForgotValues = z.infer<typeof forgotSchema>
export type ResetValues = z.infer<typeof resetSchema>
