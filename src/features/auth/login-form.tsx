import { ids } from '@/lib/photos'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, getRouteApi, useRouter } from '@tanstack/react-router'
import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { applyApiError } from '@/api/form-errors'
import { AuthLayout } from './auth-layout'
import { FormError, SubmitButton } from '@/components/form-parts'
import { SwitchLink } from './auth-parts'
import { Field } from './field'
import { safeTarget } from './redirect'
import { loginSchema, type LoginValues } from './schemas'
import { useSignIn } from './use-auth'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })
  const [formError, setFormError] = useState<string | null>(null)
  const signIn = useSignIn()
  const router = useRouter()
  const { redirect } = getRouteApi('/login').useSearch()

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await signIn.mutateAsync({ body: values })
      router.history.push(safeTarget(redirect))
    } catch (error) {
      setFormError(
        applyApiError(error, setError, ['email', 'password'], {
          401: 'Email hoặc mật khẩu không đúng.',
        }),
      )
    }
  })

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      hint="Đăng nhập để xem nhật ký ăn uống của bạn."
      headline="Ghi lại từng bữa ăn trong vài giây."
      photo={{ id: ids.breakfast, alt: 'Bàn bữa sáng với yến mạch và trái cây' }}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field
          id="email"
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Field
          id="password"
          label="Mật khẩu"
          icon={Lock}
          type="password"
          autoComplete="current-password"
          labelAside={
            <Link to="/forgot-password" className="text-primary text-sm hover:underline">
              Quên mật khẩu?
            </Link>
          }
          error={errors.password?.message}
          {...register('password')}
        />
        <FormError message={formError} />
        <SubmitButton loading={isSubmitting}>Đăng nhập</SubmitButton>
      </form>
      <SwitchLink text="Chưa có tài khoản?" to="/register" label="Đăng ký" />
    </AuthLayout>
  )
}
