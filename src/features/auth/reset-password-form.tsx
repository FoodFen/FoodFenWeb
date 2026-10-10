import { applyApiError } from '@/api/form-errors'
import { FormError, SubmitButton } from '@/components/form-parts'
import { buttonVariants } from '@/components/ui/button'
import { ids } from '@/lib/photos'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRouteApi, Link } from '@tanstack/react-router'
import { CircleCheck, Lock } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { AuthLayout } from './auth-layout'
import { Field } from './field'
import { PasswordStrength } from './password-strength'
import { resetSchema, type ResetValues } from './schemas'
import { useResetPassword } from './use-auth'

const route = getRouteApi('/auth/reset-password')

const linkClass = buttonVariants({ variant: 'link', className: 'h-auto justify-start p-0' })

export function ResetPasswordForm() {
  const { token } = route.useSearch()
  const [done, setDone] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const resetPassword = useResetPassword()
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) })
  const newPassword = useWatch({ control, name: 'newPassword' })

  const onSubmit = handleSubmit(async (values) => {
    if (!token) return
    setFormError(null)
    try {
      await resetPassword.mutateAsync({ body: { token, ...values } })
      setDone(true)
    } catch (error) {
      setFormError(applyApiError(error, setError, ['newPassword']))
    }
  })

  return (
    <AuthLayout
      title={done ? 'Đã đổi mật khẩu' : 'Đặt lại mật khẩu'}
      hint={done ? 'Bạn có thể đăng nhập bằng mật khẩu mới.' : 'Nhập mật khẩu mới cho tài khoản.'}
      headline="Đừng lo, bạn sẽ quay lại bữa ăn của mình ngay thôi."
      photo={{ id: ids.market, alt: 'Các loại đậu và rau củ tươi' }}
    >
      {done ? (
        <div className="space-y-6">
          <CircleCheck className="text-primary size-12" aria-hidden />
          <Link to="/login" className={buttonVariants({ className: 'h-11 px-4' })}>
            Đăng nhập
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {token ? (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <div className="space-y-2">
                <Field
                  id="newPassword"
                  label="Mật khẩu mới"
                  icon={Lock}
                  type="password"
                  autoComplete="new-password"
                  error={errors.newPassword?.message}
                  {...register('newPassword')}
                />
                <PasswordStrength password={newPassword ?? ''} />
              </div>
              <FormError message={formError} />
              <SubmitButton loading={isSubmitting}>Đổi mật khẩu</SubmitButton>
            </form>
          ) : (
            <FormError message="Liên kết đặt lại mật khẩu không hợp lệ." />
          )}
          <Link to="/forgot-password" className={linkClass}>
            Yêu cầu liên kết mới
          </Link>
        </div>
      )}
    </AuthLayout>
  )
}
