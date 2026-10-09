import { ids } from '@/lib/photos'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { applyApiError } from '@/api/form-errors'
import { AuthLayout } from './auth-layout'
import { FormError, SubmitButton } from '@/components/form-parts'
import { SwitchLink } from './auth-parts'
import { Field } from './field'
import { PasswordStrength } from './password-strength'
import { registerSchema, type RegisterValues } from './schemas'
import { useSignUp } from './use-auth'

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })
  const password = useWatch({ control, name: 'password' })
  const [formError, setFormError] = useState<string | null>(null)
  const signUp = useSignUp()
  const router = useRouter()

  const onSubmit = handleSubmit(async ({ displayName, ...values }) => {
    setFormError(null)
    try {
      await signUp.mutateAsync({ body: { ...values, displayName: displayName || null } })
      router.navigate({ to: '/app' })
    } catch (error) {
      setFormError(applyApiError(error, setError, ['displayName', 'email', 'password']))
    }
  })

  return (
    <AuthLayout
      title="Tạo tài khoản FoodFen"
      hint="Miễn phí, không cần thẻ thanh toán."
      headline="Bắt đầu ăn uống khỏe hơn từ hôm nay."
      photo={{ id: ids.bowl, alt: 'Tô cơm cá hồi, trứng và rau củ' }}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field
          id="displayName"
          label="Tên hiển thị"
          icon={User}
          autoComplete="name"
          error={errors.displayName?.message}
          {...register('displayName')}
        />
        <Field
          id="email"
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="space-y-2">
          <Field
            id="password"
            label="Mật khẩu"
            icon={Lock}
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrength password={password ?? ''} />
        </div>
        <FormError message={formError} />
        <SubmitButton loading={isSubmitting}>Tạo tài khoản</SubmitButton>
      </form>
      <SwitchLink text="Đã có tài khoản?" to="/login" label="Đăng nhập" />
    </AuthLayout>
  )
}
