import type { DishResponse, RestaurantResponse } from '@/api/generated'
import { RestaurantSummary } from '@/components/restaurant-summary'
import { Button } from '@/components/ui/button'
import { Check, CheckCheck, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RejectDialog } from './reject-dialog'
import { ReviewDishRow } from './review-dish-row'

type Props = {
  restaurant: RestaurantResponse
  dishes: DishResponse[]
  busy: boolean
  onApproveRestaurant: () => void
  onRejectRestaurant: (reason: string) => Promise<void>
  onApproveDish: (dish: DishResponse) => void
  onApprovePendingDishes: (dishes: DishResponse[]) => void
  onRejectDish: (dish: DishResponse, reason: string) => Promise<void>
}

type Target = { kind: 'restaurant' } | { kind: 'dish'; dish: DishResponse }

export function RestaurantReview({
  restaurant,
  dishes,
  busy,
  onApproveRestaurant,
  onRejectRestaurant,
  onApproveDish,
  onApprovePendingDishes,
  onRejectDish,
}: Props) {
  const { t } = useTranslation('admin')
  const [target, setTarget] = useState<Target | null>(null)
  const approved = restaurant.status === 'approved'
  const pending = dishes.filter((dish) => dish.status === 'pending')

  return (
    <div className="space-y-8">
      <RestaurantSummary
        restaurant={restaurant}
        actions={
          <div className="flex flex-wrap gap-2">
            {!approved && (
              <Button className="h-11 px-4" disabled={busy} onClick={onApproveRestaurant}>
                <Check aria-hidden />
                {t('review.approveRestaurant')}
              </Button>
            )}
            <Button
              variant="outline"
              className="h-11 px-4"
              disabled={busy}
              onClick={() => setTarget({ kind: 'restaurant' })}
            >
              <X aria-hidden />
              {approved ? t('review.takeDownRestaurant') : t('review.rejectRestaurant')}
            </Button>
          </div>
        }
      />
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">{t('review.menu', { count: dishes.length })}</h2>
          {pending.length >= 2 && (
            <Button
              variant="outline"
              className="h-11 px-4"
              disabled={busy}
              onClick={() => onApprovePendingDishes(pending)}
            >
              <CheckCheck aria-hidden />
              {t('review.approvePending', { count: pending.length })}
            </Button>
          )}
        </div>
        {!approved && dishes.length > 0 && (
          <p className="text-sm text-muted-foreground">{t('review.dishesHiddenUntilApproved')}</p>
        )}
        {dishes.length === 0 ? (
          <p className="text-muted-foreground">{t('review.noDishes')}</p>
        ) : (
          <ul className="divide-y">
            {dishes.map((dish) => (
              <ReviewDishRow
                key={dish.id}
                dish={dish}
                busy={busy}
                onApprove={() => onApproveDish(dish)}
                onReject={() => setTarget({ kind: 'dish', dish })}
              />
            ))}
          </ul>
        )}
      </section>
      <RejectDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        subject={target?.kind === 'dish' ? target.dish.name : restaurant.name}
        onReject={(reason) =>
          target?.kind === 'dish' ? onRejectDish(target.dish, reason) : onRejectRestaurant(reason)
        }
      />
    </div>
  )
}
