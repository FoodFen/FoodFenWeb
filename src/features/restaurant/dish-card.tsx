import type { DishResponse } from '@/api/generated'
import { DishNutrition } from '@/components/dish-nutrition'
import { RejectionNote } from '@/components/rejection-note'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { formatVnd } from '@/lib/format'
import { ImageOff, Pencil, Trash2 } from 'lucide-react'

type Props = { dish: DishResponse; onEdit: () => void; onDelete: () => void }

export function DishCard({ dish, onEdit, onDelete }: Props) {
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
        {dish.status === 'rejected' && <RejectionNote reason={dish.rejectionReason} />}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="h-11 px-4" onClick={onEdit}>
          <Pencil aria-hidden />
          Sửa
        </Button>
        <Button
          variant="outline"
          className="h-11 px-4"
          onClick={onDelete}
          aria-label={`Xoá món ${dish.name}`}
        >
          <Trash2 aria-hidden />
          Xoá
        </Button>
      </div>
    </li>
  )
}
