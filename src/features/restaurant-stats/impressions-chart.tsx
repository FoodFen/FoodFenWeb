import type { AdImpressionResponse } from '@/api/generated'
import { DailyChart } from '@/components/daily-chart'
import { formatNumber } from '@/lib/format'
import { useTranslation } from 'react-i18next'
import { sumLastDays } from './stats'

export function ImpressionsChart({ impressions }: { impressions: AdImpressionResponse[] }) {
  const { t } = useTranslation('ads')
  const total = sumLastDays(impressions, impressions.length)
  return (
    <DailyChart
      title={t('impressions.title')}
      description={t('impressions.description', { count: total, total: formatNumber(total) })}
      rows={impressions}
      series={[{ key: 'count', label: t('impressions.title'), color: 'var(--chart-1)' }]}
    />
  )
}
