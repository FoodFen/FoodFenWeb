import { PageHeader } from '@/components/page-header'
import { QueryError } from '@/components/query-error'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { ProfileForm } from './profile-form'
import { useProfile } from './use-profile'

export function ProfilePage() {
  const { t } = useTranslation('auth')
  const profile = useProfile()

  return (
    <div className="space-y-6">
      <PageHeader title={t('profile.title')} description={t('profile.hint')} />
      {profile.isPending ? (
        <Skeleton className="h-80 w-full rounded-2xl" aria-busy />
      ) : profile.data ? (
        <ProfileForm user={profile.data} />
      ) : (
        <QueryError error={profile.error} onRetry={() => void profile.refetch()} />
      )}
    </div>
  )
}
