import { buttonVariants } from '@/components/ui/button'
import { ids } from '@/lib/photos'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, CircleCheck, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { applyApiError } from '@/api/form-errors'
import { AuthLayout } from './auth-layout'
import { FormError, SubmitButton } from '@/components/form-parts'
import { Field } from './field'
import { forgotSchema, type ForgotValues } from './schemas'
import { usePasswordReset } from './use-auth'

function BackToLogin() {
  const { t } = useTranslation('auth')
  return (
    <Link
      to="/login"
      className={buttonVariants({ variant: 'link', className: 'h-auto justify-start p-0' })}
    >
      <ArrowLeft aria-hidden />
      {t('forgot.backToLogin')}
    </Link>
  )
}

export function ForgotPasswordForm() {
  const { t } = useTranslation('auth')
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
      title={sentTo ? t('forgot.sentTitle') : t('forgot.title')}
      hint={sentTo ? t('forgot.sentHint', { email: sentTo }) : t('forgot.hint')}
      headline={t('forgot.headline')}
      photo={{ id: ids.market, alt: t('photoAlt.market') }}
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
              label={t('email')}
              icon={Mail}
              type="email"
              autoComplete="email"
              enterKeyHint="go"
              error={errors.email?.message}
              {...register('email')}
            />
            <FormError message={formError} />
            <SubmitButton loading={isSubmitting}>{t('forgot.submit')}</SubmitButton>
          </form>
          <BackToLogin />
        </>
      )}
    </AuthLayout>
  )
}
