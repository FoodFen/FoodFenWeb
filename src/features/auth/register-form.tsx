import { ids } from '@/lib/photos'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRouteApi, useRouter } from '@tanstack/react-router'
import { Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { applyApiError } from '@/api/form-errors'
import { AuthLayout } from './auth-layout'
import { FormError, SubmitButton } from '@/components/form-parts'
import { SwitchLink } from './auth-parts'
import { Field } from './field'
import { PasswordStrength } from './password-strength'
import { safeTarget } from './redirect'
import { registerSchema, type RegisterValues } from './schemas'
import { useSignUp } from './use-auth'

export function RegisterForm() {
  const { t } = useTranslation('auth')
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
  const { redirect } = getRouteApi('/register').useSearch()

  const onSubmit = handleSubmit(async ({ displayName, ...values }) => {
    setFormError(null)
    try {
      await signUp.mutateAsync({ body: { ...values, displayName: displayName || null } })
      router.history.push(safeTarget(redirect))
    } catch (error) {
      setFormError(applyApiError(error, setError, ['displayName', 'email', 'password']))
    }
  })

  return (
    <AuthLayout
      title={t('register.title')}
      hint={t('register.hint')}
      headline={t('register.headline')}
      photo={{ id: ids.bowl, alt: t('photoAlt.bowl') }}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field
          id="displayName"
          label={t('displayName')}
          icon={User}
          autoComplete="name"
          error={errors.displayName?.message}
          {...register('displayName')}
        />
        <Field
          id="email"
          label={t('email')}
          icon={Mail}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="space-y-2">
          <Field
            id="password"
            label={t('password')}
            icon={Lock}
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrength password={password ?? ''} />
        </div>
        <FormError message={formError} />
        <SubmitButton loading={isSubmitting}>{t('register.submit')}</SubmitButton>
      </form>
      <SwitchLink
        text={t('register.haveAccount')}
        to="/login"
        label={t('register.login')}
        redirect={redirect}
      />
    </AuthLayout>
  )
}
