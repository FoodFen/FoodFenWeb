import { ids } from '@/lib/photos'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, getRouteApi, useRouter } from '@tanstack/react-router'
import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { applyApiError } from '@/api/form-errors'
import { AuthLayout } from './auth-layout'
import { FormError, SubmitButton } from '@/components/form-parts'
import { SwitchLink } from './auth-parts'
import { Field } from './field'
import { safeTarget } from './redirect'
import { loginSchema, type LoginValues } from './schemas'
import { useSignIn } from './use-auth'

export function LoginForm() {
  const { t } = useTranslation('auth')
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
          401: t('login.invalidCredentials'),
        }),
      )
    }
  })

  return (
    <AuthLayout
      title={t('login.title')}
      hint={t('login.hint')}
      headline={t('login.headline')}
      photo={{ id: ids.breakfast, alt: t('photoAlt.breakfast') }}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field
          id="email"
          label={t('email')}
          icon={Mail}
          type="email"
          autoComplete="email"
          enterKeyHint="next"
          error={errors.email?.message}
          {...register('email')}
        />
        <Field
          id="password"
          label={t('password')}
          icon={Lock}
          type="password"
          autoComplete="current-password"
          enterKeyHint="go"
          labelAside={
            <Link to="/forgot-password" className="text-primary text-sm hover:underline">
              {t('login.forgot')}
            </Link>
          }
          error={errors.password?.message}
          {...register('password')}
        />
        <FormError message={formError} />
        <SubmitButton loading={isSubmitting}>{t('login.submit')}</SubmitButton>
      </form>
      <SwitchLink
        text={t('login.noAccount')}
        to="/register"
        label={t('login.register')}
        redirect={redirect}
      />
    </AuthLayout>
  )
}
