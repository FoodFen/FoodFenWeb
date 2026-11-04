import type { AdminFoodResponse } from '@/api/generated'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Archive, ArchiveRestore } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useArchiveFood, useUnarchiveFood } from './use-foods'

/** Archives the food (hidden from the app, kept in the catalog) or brings it back, after a confirmation. */
export function FoodArchiveButton({ food }: { food: AdminFoodResponse }) {
  const { t } = useTranslation('admin')
  const [open, setOpen] = useState(false)
  const archive = useArchiveFood()
  const unarchive = useUnarchiveFood()
  // Frozen when the confirm opens, so the refetch after the request cannot turn it into the opposite action.
  const [key, setKey] = useState<'archive' | 'unarchive'>('archive')
  const action = key === 'unarchive' ? unarchive : archive

  return (
    <>
      <Button
        variant="outline"
        className="h-11 px-4"
        onClick={() => {
          setKey(food.archived ? 'unarchive' : 'archive')
          setOpen(true)
        }}
      >
        {food.archived ? <ArchiveRestore aria-hidden /> : <Archive aria-hidden />}
        {t(food.archived ? 'foods.unarchive.action' : 'foods.archive.action')}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t(`foods.${key}.title`, { name: food.name })}
        description={t(`foods.${key}.body`)}
        confirmLabel={t(`foods.${key}.action`)}
        busy={action.isPending}
        onConfirm={() =>
          action.mutate({ path: { slug: food.slug } }, { onSettled: () => setOpen(false) })
        }
      />
    </>
  )
}
