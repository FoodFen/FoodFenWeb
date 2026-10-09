import type { DishResponse } from '@/api/generated'
import { Button } from '@/components/ui/button'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { DishCard } from './dish-card'

type Props = {
  dishes: DishResponse[]
  onAdd: () => void
  onEdit: (dish: DishResponse) => void
  onDelete: (dish: DishResponse) => void
}

export function DishList({ dishes, onAdd, onEdit, onDelete }: Props) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Thực đơn</h2>
        <Button className="h-11 px-4" onClick={onAdd}>
          <Plus aria-hidden />
          Thêm món
        </Button>
      </div>
      {dishes.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-2xl border border-dashed py-12 text-center">
          <UtensilsCrossed className="size-8" aria-hidden />
          <p>Chưa có món nào. Thêm món kèm dinh dưỡng để quán được xét duyệt.</p>
        </div>
      ) : (
        <ul className="divide-y">
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onEdit={() => onEdit(dish)}
              onDelete={() => onDelete(dish)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
