import type { DishResponse } from '@/api/generated'
import { DishNutrition } from '@/components/dish-nutrition'
import { RejectionNote } from '@/components/rejection-note'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { formatNumber, formatVnd } from '@/lib/format'
import { estimateKcal, kcalLooksOff } from '@/lib/nutrition'
import { Check, ImageOff, TriangleAlert, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Props = { dish: DishResponse; busy: boolean; onApprove: () => void; onReject: () => void }

export function ReviewDishRow({ dish, busy, onApprove, onReject }: Props) {
  const { t } = useTranslation('admin')
  const off = kcalLooksOff(dish.kcal, dish)
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start">
      {dish.imageUrl ? (
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="size-24 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="bg-muted text-muted-foreground flex size-24 shrink-0 items-center justify-center rounded-xl">
          <ImageOff className="size-6" aria-hidden />
        </div>
      )}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">{dish.name}</h3>
          <StatusBadge status={dish.status} />
        </div>
        <p className="text-sm font-medium tabular-nums">{formatVnd(dish.price)}</p>
        <DishNutrition {...dish} />
        <p
          className={`flex items-center gap-1.5 text-sm tabular-nums ${off ? 'text-destructive' : 'text-muted-foreground'}`}
        >
          {off && <TriangleAlert className="size-4" aria-hidden />}
          {t('review.estimate', { value: formatNumber(estimateKcal(dish)) })}
        </p>
        {dish.status === 'rejected' && <RejectionNote reason={dish.rejectionReason} />}
      </div>
      <div className="flex gap-2">
        {dish.status !== 'approved' && (
          <Button className="h-11 px-4" disabled={busy} onClick={onApprove}>
            <Check aria-hidden />
            {t('review.approve')}
          </Button>
        )}
        <Button variant="outline" className="h-11 px-4" disabled={busy} onClick={onReject}>
          <X aria-hidden />
          {dish.status === 'approved' ? t('review.takeDown') : t('review.reject')}
        </Button>
      </div>
    </li>
  )
}
