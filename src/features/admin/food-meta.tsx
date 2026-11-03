import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'
import type { AdminFoodDetail } from './food-types'

/** What the admin should know before editing: the slug (never changes), the source and the last editor. */
export function FoodMeta({ food }: { food: AdminFoodDetail }) {
  const { t } = useTranslation('admin')
  return (
    <div className="space-y-1 text-sm">
      <p className="flex flex-wrap items-center gap-2">
        <code className="text-muted-foreground font-mono">{food.slug}</code>
        {food.archived && <Badge variant="secondary">{t('foods.archivedBadge')}</Badge>}
      </p>
      <p className="text-muted-foreground">
        {t('foods.dialog.source', { source: t(`foods.sources.${food.sourceKind}`) })}
        {food.updatedByEmail && ` · ${t('foods.dialog.updatedBy', { email: food.updatedByEmail })}`}
      </p>
    </div>
  )
}
