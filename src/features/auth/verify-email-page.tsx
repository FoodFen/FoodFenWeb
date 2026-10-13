import { parseApiError } from '@/api/errors'
import { verifyEmailAuthVerifyEmailGetOptions } from '@/api/generated/@tanstack/react-query.gen'
import { FormError } from '@/components/form-parts'
import { buttonVariants } from '@/components/ui/button'
import { ids } from '@/lib/photos'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { CircleCheck, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from './auth-layout'

const route = getRouteApi('/auth/verify-email')

function Result({ token }: { token: string | undefined }) {
  const { t } = useTranslation('auth')
  const { isPending, isSuccess, error } = useQuery({
    ...verifyEmailAuthVerifyEmailGetOptions({ query: { token: token ?? '' } }),
    enabled: !!token,
    retry: false,
  })

  if (token && isPending) {
    return (
      <LoaderCircle
        className="text-primary size-12 animate-spin"
        aria-label={t('verify.confirming')}
      />
    )
  }
  if (isSuccess) {
    return (
      <div className="space-y-6">
        <CircleCheck className="text-primary size-12" aria-hidden />
        <p className="text-lg font-medium">{t('verify.done')}</p>
        <Link to="/login" className={buttonVariants({ className: 'h-11 px-4' })}>
          {t('verify.login')}
        </Link>
      </div>
    )
  }
  return <FormError message={error ? parseApiError(error).message : t('verify.invalidLink')} />
}

export function VerifyEmailPage() {
  const { t } = useTranslation('auth')
  const { token } = route.useSearch()
  return (
    <AuthLayout
      title={t('verify.title')}
      hint={t('verify.hint')}
      headline={t('verify.headline')}
      photo={{ id: ids.bowl, alt: t('photoAlt.bowl') }}
    >
      <Result token={token} />
    </AuthLayout>
  )
}
