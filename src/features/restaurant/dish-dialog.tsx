import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DishForm } from './dish-form'

type Props = Pick<Parameters<typeof DishForm>[0], 'defaultValues' | 'onSubmit' | 'upload'> & {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Editing an approved or rejected dish sends it back to review; say so before the owner saves. */
  editing: boolean
}

export function DishDialog({ open, onOpenChange, editing, ...form }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? 'Sửa món' : 'Thêm món'}</DialogTitle>
          <DialogDescription>
            {editing
              ? 'Sau khi lưu, món sẽ được ẩn và chờ duyệt lại.'
              : 'Món mới sẽ hiển thị sau khi được duyệt.'}
          </DialogDescription>
        </DialogHeader>
        <DishForm {...form} submitLabel={editing ? 'Lưu và gửi duyệt lại' : 'Gửi duyệt'} />
      </DialogContent>
    </Dialog>
  )
}
