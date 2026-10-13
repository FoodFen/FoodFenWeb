import type { DishResponse } from '@/api/generated'
import { EmptyState } from '@/components/empty-state'
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
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('dish.list.title')}</h2>
        <Button className="h-11 px-4" onClick={onAdd}>
          <Plus aria-hidden />
          {t('dish.list.add')}
        </Button>
      </div>
      {dishes.length === 0 ? (
        <div className="rounded-2xl border border-dashed">
          <EmptyState icon={UtensilsCrossed} title={t('dish.list.empty')} className="py-12" />
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
