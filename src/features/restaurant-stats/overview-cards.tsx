import type { MyAdsResponse, RestaurantResponse } from '@/api/generated'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { formatVnd } from '@/lib/format'
import { CircleCheck, CircleX, Clock, Eye, Megaphone, Store, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FeaturedStatus } from './featured-status'
import { InfoCard } from './info-card'
import { sumLastDays, type MenuSummary } from './stats'

type Props = {
  restaurant: RestaurantResponse
  ads: MyAdsResponse
  menu: MenuSummary
  /** Paid total over the payments loaded so far. */
  spend: number
  loadedPayments: number
  /** True while older payments are still unloaded, so `spend` is only a partial sum. */
  partialSpend: boolean
}

export function OverviewCards({
  restaurant,
  ads,
  menu,
  spend,
  loadedPayments,
  partialSpend,
}: Props) {
  const { t } = useTranslation('restaurant')
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <InfoCard icon={Store} label={t('stats.cards.status')}>
        <div>
          <StatusBadge status={restaurant.status} />
        </div>
      </InfoCard>
      <InfoCard icon={Megaphone} label={t('stats.cards.featured')}>
        <FeaturedStatus
          featuredUntil={ads.featuredUntil}
          approved={restaurant.status === 'approved'}
        />
      </InfoCard>
      <StatCard
        icon={Eye}
        label={t('stats.cards.impressions7')}
        value={sumLastDays(ads.impressions, 7)}
      />
      <StatCard
        icon={Eye}
        label={t('stats.cards.impressions30')}
        value={sumLastDays(ads.impressions, 30)}
      />
      <StatCard
        icon={Wallet}
        label={
          partialSpend
            ? t('stats.cards.spendRecent', { count: loadedPayments })
            : t('stats.cards.spend')
        }
        value={spend}
        format={formatVnd}
      />
      <StatCard
        icon={CircleCheck}
        label={t('stats.cards.approved')}
        value={menu.byStatus.approved}
      />
      <StatCard icon={Clock} label={t('stats.cards.pending')} value={menu.byStatus.pending} />
      <StatCard icon={CircleX} label={t('stats.cards.rejected')} value={menu.byStatus.rejected} />
    </div>
  )
}
