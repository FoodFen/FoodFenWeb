import type { DishResponse } from '@/api/generated'
import { Button } from '@/components/ui/button'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DishCard } from './dish-card'

type Props = {
  dishes: DishResponse[]
  onAdd: () => void
  onEdit: (dish: DishResponse) => void
  onDelete: (dish: DishResponse) => void
}

export function DishList({ dishes, onAdd, onEdit, onDelete }: Props) {
  const { t } = useTranslation('restaurant')
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{t('dish.list.title')}</h2>
        <Button className="h-11 px-4" onClick={onAdd}>
          <Plus aria-hidden />
          {t('dish.list.add')}
        </Button>
      </div>
      {dishes.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-2xl border border-dashed py-12 text-center">
          <UtensilsCrossed className="size-8" aria-hidden />
          <p>{t('dish.list.empty')}</p>
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
