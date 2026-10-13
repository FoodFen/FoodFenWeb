import { parseApiError } from '@/api/errors'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { ProfileForm } from './profile-form'
import { useProfile } from './use-profile'

export function ProfilePage() {
  const { t } = useTranslation('auth')
  const { t: tc } = useTranslation()
  const profile = useProfile()

  return (
    <div className="max-w-xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{t('profile.title')}</h1>
        <p className="text-muted-foreground">{t('profile.hint')}</p>
      </header>
      {profile.isPending ? (
        <Skeleton className="h-80 w-full rounded-2xl" aria-busy />
      ) : profile.data ? (
        <ProfileForm user={profile.data} />
      ) : (
        <div className="space-y-3">
          <p role="alert">{parseApiError(profile.error).message}</p>
          <Button variant="outline" className="h-11 px-4" onClick={() => void profile.refetch()}>
            {tc('retry')}
          </Button>
        </div>
      )}
    </div>
  )
}
