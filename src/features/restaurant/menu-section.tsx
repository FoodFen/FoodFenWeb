import { parseApiError } from '@/api/errors'
import type { DishResponse } from '@/api/generated'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { DishDialog } from './dish-dialog'
import { DishList } from './dish-list'
import { emptyDish, toDishValues } from './dish-schema'
import { useCreateDish, useDeleteDish, useMyDishes, useUpdateDish } from './use-dishes'

/** `dish` is set when editing; an empty editor adds a new dish. */
type Editor = { dish?: DishResponse }

export function MenuSection({ upload }: { upload: (file: File) => Promise<string> }) {
  const dishes = useMyDishes()
  const create = useCreateDish()
  const update = useUpdateDish()
  const { remove, isPending: removing } = useDeleteDish()
  const [editor, setEditor] = useState<Editor | null>(null)
  const [toDelete, setToDelete] = useState<DishResponse | null>(null)

  if (dishes.isPending) return <Skeleton className="h-40 w-full rounded-2xl" aria-busy />

  if (dishes.isError) {
    return (
      <div className="space-y-3">
        <p role="alert">{parseApiError(dishes.error).message}</p>
        <Button variant="outline" className="h-11 px-4" onClick={() => void dishes.refetch()}>
          Thử lại
        </Button>
      </div>
    )
  }

  return (
    <>
      <DishList
        dishes={dishes.data}
        onAdd={() => setEditor({})}
        onEdit={(dish) => setEditor({ dish })}
        onDelete={setToDelete}
      />
      <DishDialog
        key={editor?.dish?.id ?? 'new'}
        open={editor !== null}
        onOpenChange={(open) => !open && setEditor(null)}
        editing={editor?.dish !== undefined}
        defaultValues={editor?.dish ? toDishValues(editor.dish) : emptyDish}
        upload={upload}
        onSubmit={async (values, dirty) => {
          if (editor?.dish) await update(editor.dish.id, values, dirty)
          else await create(values)
          setEditor(null)
        }}
      />
      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`Xoá món ${toDelete?.name ?? ''}?`}
        description="Món sẽ bị xoá khỏi thực đơn và không thể khôi phục."
        confirmLabel="Xoá món"
        busy={removing}
        onConfirm={async () => {
          if (toDelete) await remove(toDelete.id)
          setToDelete(null)
        }}
      />
    </>
  )
}
