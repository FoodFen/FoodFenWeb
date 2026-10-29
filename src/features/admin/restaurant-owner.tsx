import { useTranslation } from 'react-i18next'
import { useRestaurantList } from './use-moderation'

/** Owner of a restaurant, read from the list rows (the detail API has no owner fields). */
export function RestaurantOwner({ restaurantId }: { restaurantId: string }) {
  const { t } = useTranslation('admin')
  const row = useRestaurantList('all').data?.find((r) => r.id === restaurantId)
  if (!row) return null
  return (
    <p className="text-muted-foreground text-sm">
      {t('review.owner')}: {row.ownerName ? `${row.ownerName}, ` : ''}
      <a href={`mailto:${row.ownerEmail}`} className="underline-offset-4 hover:underline">
        {row.ownerEmail}
      </a>
    </p>
  )
}
