import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export type TierFilter = 'all' | 'free' | 'premium'

const tiers: TierFilter[] = ['all', 'free', 'premium']

export function UsersToolbar({
  query,
  onQuery,
  tier,
  onTier,
}: {
  query: string
  onQuery: (value: string) => void
  tier: TierFilter
  onTier: (value: TierFilter) => void
}) {
  const { t } = useTranslation('admin')
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <SearchInput
        className="sm:max-w-xs"
        value={query}
        onChange={onQuery}
        placeholder={t('users.searchPlaceholder')}
        label={t('users.searchLabel')}
      />
      <div role="group" aria-label={t('users.tierFilter')} className="flex gap-1.5">
        {tiers.map((value) => (
          <Button
            key={value}
            variant={tier === value ? 'default' : 'outline'}
            aria-pressed={tier === value}
            onClick={() => onTier(value)}
            className="h-11 px-4"
          >
            {t(`users.tiers.${value}`)}
          </Button>
        ))}
      </div>
    </div>
  )
}
