import type { AdminMascotResponse } from '@/api/generated'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EmptyState } from '@/components/empty-state'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PawPrint } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MascotRow } from './mascot-row'
import { useDeleteMascot, useSetMascotActive } from './use-mascots'

type Props = { rows: AdminMascotResponse[]; onEdit: (mascot: AdminMascotResponse) => void }

/** A confirmation waiting for the admin: hiding a mascot people use, or deleting one. */
type Pending = { kind: 'hide' | 'delete'; mascot: AdminMascotResponse } | null

export function MascotsTable({ rows, onEdit }: Props) {
  const { t } = useTranslation('admin')
  const setActive = useSetMascotActive()
  const remove = useDeleteMascot()
  const [pending, setPending] = useState<Pending>(null)
  const close = { onSettled: () => setPending(null) }

  if (rows.length === 0) {
    return (
      <EmptyState icon={PawPrint} title={t('mascots.empty.title')} hint={t('mascots.empty.hint')} />
    )
  }

  const toggle = (mascot: AdminMascotResponse, active: boolean) =>
    active || mascot.equippedCount === 0
      ? setActive.mutate({ path: { mascot_id: mascot.id }, body: { active } })
      : setPending({ kind: 'hide', mascot })
  const name = pending?.mascot.name ?? ''

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">
              <span className="sr-only">{t('mascots.columns.art')}</span>
            </TableHead>
            <TableHead>{t('mascots.columns.name')}</TableHead>
            <TableHead className="hidden md:table-cell">{t('mascots.columns.id')}</TableHead>
            <TableHead>{t('mascots.columns.price')}</TableHead>
            <TableHead className="hidden md:table-cell">{t('mascots.columns.usage')}</TableHead>
            <TableHead>{t('mascots.columns.active')}</TableHead>
            <TableHead className="w-36">
              <span className="sr-only">{t('table.actions')}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((mascot) => (
            <MascotRow
              key={mascot.id}
              mascot={mascot}
              busy={setActive.isPending || remove.isPending}
              onEdit={() => onEdit(mascot)}
              onToggle={(active) => toggle(mascot, active)}
              onDelete={() => setPending({ kind: 'delete', mascot })}
            />
          ))}
        </TableBody>
      </Table>
      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title={t(
          pending?.kind === 'hide' ? 'mascots.confirm.hideTitle' : 'mascots.confirm.deleteTitle',
          { name },
        )}
        description={
          pending?.kind === 'hide'
            ? t('mascots.confirm.hideBody', { count: pending.mascot.equippedCount })
            : t('mascots.confirm.deleteBody')
        }
        confirmLabel={t(
          pending?.kind === 'hide' ? 'mascots.confirm.hideAction' : 'mascots.confirm.deleteAction',
        )}
        busy={setActive.isPending || remove.isPending}
        onConfirm={() => {
          if (pending?.kind === 'hide')
            setActive.mutate(
              { path: { mascot_id: pending.mascot.id }, body: { active: false } },
              close,
            )
          else if (pending) remove.mutate({ path: { mascot_id: pending.mascot.id } }, close)
        }}
      />
    </>
  )
}
