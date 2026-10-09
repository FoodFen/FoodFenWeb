import { buttonVariants } from '@/components/ui/button'
import { ids } from '@/lib/photos'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, CircleCheck, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { applyApiError } from '@/api/form-errors'
import { AuthLayout } from './auth-layout'
import { FormError, SubmitButton } from '@/components/form-parts'
import { Field } from './field'
import { forgotSchema, type ForgotValues } from './schemas'
import { usePasswordReset } from './use-auth'

function BackToLogin() {
  return (
    <Link
      to="/login"
      className={buttonVariants({ variant: 'link', className: 'h-auto justify-start p-0' })}
    >
      <ArrowLeft aria-hidden />
      Quay lại đăng nhập
    </Link>
  )
}

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const passwordReset = usePasswordReset()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) })

  // The BE answers the same way whether or not the email exists, so this screen does too.
  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await passwordReset.mutateAsync({ body: values })
      setSentTo(values.email)
    } catch (error) {
      setFormError(applyApiError(error, setError, ['email']))
    }
  })

  return (
    <AuthLayout
      title={sentTo ? 'Kiểm tra hộp thư của bạn' : 'Quên mật khẩu?'}
      hint={
        sentTo
          ? `Nếu ${sentTo} đã đăng ký, chúng tôi vừa gửi hướng dẫn đặt lại mật khẩu.`
          : 'Nhập email, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.'
      }
      headline="Đừng lo, bạn sẽ quay lại bữa ăn của mình ngay thôi."
      photo={{ id: ids.market, alt: 'Các loại đậu và rau củ tươi' }}
    >
      {sentTo ? (
        <div className="space-y-6">
          <CircleCheck className="text-primary size-12" aria-hidden />
          <BackToLogin />
        </div>
      ) : (
        <>
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
            <FormError message={formError} />
            <SubmitButton loading={isSubmitting}>Gửi hướng dẫn</SubmitButton>
          </form>
          <BackToLogin />
        </>
      )}
    </AuthLayout>
  )
}
