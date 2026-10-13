import { z } from 'zod'

// The BE takes 3 to 320 characters for an email and 1 to 72 for a sign-in password.
const email = z.string().trim().pipe(z.email('validation:email').max(320, 'validation:emailMax'))
const password = z.string().min(8, 'validation:passwordMin').max(72, 'validation:passwordMax')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'validation:passwordRequired').max(72, 'validation:passwordMax'),
})

export const registerSchema = z.object({
  displayName: z.string().trim().max(100, 'validation:displayNameMax').optional(),
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
