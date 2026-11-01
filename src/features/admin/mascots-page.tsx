import type { AdminMascotResponse } from '@/api/generated'
import { PageHeader } from '@/components/page-header'
import { QueryError } from '@/components/query-error'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MascotDialog } from './mascot-dialog'
import { MascotsTable } from './mascots-table'
import { useMascots } from './use-mascots'

/** `undefined`: dialog closed. `null`: creating. A mascot: editing it. */
type Editing = AdminMascotResponse | null | undefined

export function MascotsPage() {
  const { t } = useTranslation('admin')
  const mascots = useMascots()
  const [editing, setEditing] = useState<Editing>(undefined)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('mascots.title')}
        description={t('mascots.description')}
        actions={
          <Button className="h-11 px-4" onClick={() => setEditing(null)}>
            <Plus aria-hidden />
            {t('mascots.add')}
          </Button>
        }
      />
      <Card className="rounded-2xl p-2">
        {mascots.isPending ? (
          <Skeleton className="h-40 w-full" aria-busy />
        ) : mascots.isError ? (
          <QueryError error={mascots.error} onRetry={() => void mascots.refetch()} />
        ) : (
          <MascotsTable rows={mascots.data} onEdit={setEditing} />
        )}
      </Card>
      {editing !== undefined && (
        <MascotDialog
          key={editing?.id ?? 'new'}
          open
          editing={editing}
          onOpenChange={(open) => !open && setEditing(undefined)}
        />
      )}
    </div>
  )
}
