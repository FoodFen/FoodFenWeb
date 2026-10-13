import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'
import { DishForm } from './dish-form'

type Props = Pick<Parameters<typeof DishForm>[0], 'defaultValues' | 'onSubmit' | 'upload'> & {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Editing an approved or rejected dish sends it back to review; say so before the owner saves. */
  editing: boolean
}

export function DishDialog({ open, onOpenChange, editing, ...form }: Props) {
  const { t } = useTranslation('restaurant')
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? t('dish.dialog.editTitle') : t('dish.dialog.addTitle')}
          </DialogTitle>
          <DialogDescription>
            {editing ? t('dish.dialog.editDescription') : t('dish.dialog.addDescription')}
          </DialogDescription>
        </DialogHeader>
        <DishForm
          {...form}
          submitLabel={editing ? t('dish.dialog.submitEdit') : t('dish.dialog.submitNew')}
        />
      </DialogContent>
    </Dialog>
  )
}
