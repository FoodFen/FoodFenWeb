import type {
  FoodCategory,
  FoodChangeResponse,
  FoodSnapshot,
  FoodSourceKind,
} from '@/api/generated'
import { formatDateTime } from '@/lib/format'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { diffFood } from './food-diff'

const isServing = (value: unknown): value is { label: string; grams: number } =>
  typeof value === 'object' && value !== null && 'label' in value && 'grams' in value

/** One snapshot value as text: nothing is "empty", lists are joined, servings read "1 bát (250 g)". */
function formatValue(field: keyof FoodSnapshot, value: unknown, t: TFunction<'admin'>) {
  if (field === 'category' && typeof value === 'string') {
    return t(`foods.categories.${value as FoodCategory}`)
  }
  if (field === 'sourceKind' && typeof value === 'string') {
    return t(`foods.sources.${value as FoodSourceKind}`)
  }
  if (value === null || (Array.isArray(value) && value.length === 0))
    return t('foods.history.empty')
  if (typeof value === 'boolean') return t(value ? 'foods.history.yes' : 'foods.history.no')
  if (Array.isArray(value)) {
    return value
      .map((item) => (isServing(item) ? `${item.label} (${item.grams} g)` : String(item)))
      .join(', ')
  }
  return String(value)
}

export function FoodChangeRow({ change }: { change: FoodChangeResponse }) {
  const { t } = useTranslation('admin')
  const diffs = change.action === 'update' ? diffFood(change.before, change.after) : []

  return (
    <li className="space-y-1 py-3 text-sm">
      <p className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="font-medium">
          {change.adminEmail ?? t('foods.history.deletedAdmin')}
          <span className="text-muted-foreground font-normal">
            {' '}
            {t(`foods.actions.${change.action}`)}
          </span>
        </span>
        <time dateTime={change.createdAt} className="text-muted-foreground tabular-nums">
          {formatDateTime(change.createdAt)}
        </time>
      </p>
      {diffs.length > 0 && (
        <ul className="text-muted-foreground space-y-0.5">
          {diffs.map(({ field, before, after }) => (
            <li key={field}>
              {t(`foods.fields.${field}`)}: {formatValue(field, before, t)}
              {' → '}
              {formatValue(field, after, t)}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
