import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
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
      <div className="relative w-full sm:max-w-xs">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={t('users.searchPlaceholder')}
          aria-label={t('users.searchLabel')}
          className="h-11 pl-10"
        />
      </div>
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
