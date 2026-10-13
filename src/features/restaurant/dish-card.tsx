import type { DishResponse } from '@/api/generated'
import { DishNutrition } from '@/components/dish-nutrition'
import { DishThumb } from '@/components/dish-thumb'
import { RejectionNote } from '@/components/rejection-note'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { formatVnd } from '@/lib/format'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Props = { dish: DishResponse; onEdit: () => void; onDelete: () => void }

export function DishCard({ dish, onEdit, onDelete }: Props) {
  const { t } = useTranslation('restaurant')
  return (
    <li className="flex flex-wrap gap-3 py-4 sm:flex-nowrap sm:items-start">
      <DishThumb url={dish.imageUrl} name={dish.name} />
      <div className="min-w-48 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">{dish.name}</h3>
          <StatusBadge status={dish.status} />
        </div>
        <p className="text-sm font-medium tabular-nums">{formatVnd(dish.price)}</p>
        <DishNutrition {...dish} />
        {dish.status === 'rejected' && <RejectionNote reason={dish.rejectionReason} />}
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        <Button variant="outline" className="h-11 px-4" onClick={onEdit}>
          <Pencil aria-hidden />
          {t('dish.card.edit')}
        </Button>
        <Button
          variant="outline"
          className="h-11 px-4"
          onClick={onDelete}
          aria-label={t('dish.card.deleteNamed', { name: dish.name })}
        >
          <Trash2 aria-hidden />
          {t('dish.card.delete')}
        </Button>
      </div>
    </li>
  )
}
