import { QueryError } from '@/components/query-error'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { FoodArchiveButton } from './food-archive-button'
import { FoodForm } from './food-form'
import { FoodHistory } from './food-history'
import { FoodMeta } from './food-meta'
import type { FoodPrefill } from './food-schema'
import { useAdminFood } from './use-foods'

type Props = {
  /** The food to edit; `null` creates one, starting from `prefill`. */
  slug: string | null
  prefill?: FoodPrefill
  onClose: () => void
}

export function FoodDialog({ slug, prefill, onClose }: Props) {
  const { t } = useTranslation('admin')
  const detail = useAdminFood(slug)
  const food = detail.data

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {slug ? t('foods.dialog.editTitle') : t('foods.dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {slug ? t('foods.dialog.editDescription') : t('foods.dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>
        {slug === null ? (
          <FoodForm food={null} prefill={prefill} onDone={onClose} />
        ) : detail.isError ? (
          <QueryError error={detail.error} onRetry={() => void detail.refetch()} />
        ) : !food ? (
          <Skeleton className="h-64 w-full" aria-busy />
        ) : (
          <>
            <FoodMeta food={food} />
            <FoodForm food={food} onDone={onClose} />
            <FoodArchiveButton food={food} />
            <FoodHistory slug={food.slug} />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
