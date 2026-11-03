import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Archive, ArchiveRestore } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AdminFoodDetail } from './food-types'
import { useArchiveFood, useUnarchiveFood } from './use-foods'

/** Archives the food (hidden from the app, kept in the catalog) or brings it back, after a confirmation. */
export function FoodArchiveButton({ food }: { food: AdminFoodDetail }) {
  const { t } = useTranslation('admin')
  const [open, setOpen] = useState(false)
  const archive = useArchiveFood()
  const unarchive = useUnarchiveFood()
  const action = food.archived ? unarchive : archive
  const key = food.archived ? 'unarchive' : 'archive'

  return (
    <>
      <Button variant="outline" className="h-11 px-4" onClick={() => setOpen(true)}>
        {food.archived ? <ArchiveRestore aria-hidden /> : <Archive aria-hidden />}
        {t(`foods.${key}.action`)}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t(`foods.${key}.title`, { name: food.name })}
        description={t(`foods.${key}.body`)}
        confirmLabel={t(`foods.${key}.action`)}
        busy={action.isPending}
        onConfirm={() => action.mutate(food.slug, { onSettled: () => setOpen(false) })}
      />
    </>
  )
}
