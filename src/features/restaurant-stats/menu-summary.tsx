import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DIET_TAGS } from '@/lib/diet-tag'
import { formatNumber, formatVnd } from '@/lib/format'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { MenuSummary as Summary } from './stats'

export function MenuSummary({ menu }: { menu: Summary }) {
  const { t } = useTranslation('restaurant')
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">{t('stats.menu.title')}</CardTitle>
      </CardHeader>
      <CardContent>{menu.count === 0 ? <EmptyMenu /> : <Figures menu={menu} />}</CardContent>
    </Card>
  )
}

const outlineLink = buttonVariants({ variant: 'outline', className: 'h-11 px-4' })

function EmptyMenu() {
  const { t } = useTranslation('restaurant')
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-muted-foreground">{t('stats.menu.empty')}</p>
      <Link to="/restaurant" className={outlineLink}>
        {t('stats.menu.add')}
      </Link>
    </div>
  )
}

function Figures({ menu }: { menu: Summary }) {
  const { t } = useTranslation(['restaurant', 'common'])
  const kcal = (value: number) => t('common:nutrition.kcal', { value: formatNumber(value) })
  const range = (min: string, max: string) => t('stats.menu.range', { min, max })
  const items = [
    [t('stats.menu.avgKcal'), kcal(menu.avgKcal)],
    [t('stats.menu.kcalRange'), range(kcal(menu.kcal.min), kcal(menu.kcal.max))],
    [t('stats.menu.priceRange'), range(formatVnd(menu.price.min), formatVnd(menu.price.max))],
    ...DIET_TAGS.map((diet) => [t(`common:dietTag.${diet}`), formatNumber(menu.byDiet[diet])]),
    [t('stats.menu.flagged'), formatNumber(menu.flagged)],
  ]
  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {items.map(([label, value]) => (
          <div key={label} className="space-y-1">
            <dt className="text-muted-foreground text-sm">{label}</dt>
            <dd className="font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      {menu.flagged > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-muted-foreground text-sm">{t('stats.menu.flaggedHint')}</p>
          <Link to="/restaurant" className={outlineLink}>
            {t('stats.menu.fix')}
          </Link>
        </div>
      )}
    </div>
  )
}
