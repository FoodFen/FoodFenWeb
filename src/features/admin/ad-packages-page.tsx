import type { AdPackageResponse } from '@/api/generated'
import { QueryError } from '@/components/query-error'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdPackageDialog } from './ad-package-dialog'
import { AdPackagesTable } from './ad-packages-table'
import { PageHeader } from '@/components/page-header'
import { useAdPackages } from './use-ad-packages'

/** `undefined`: dialog closed. `null`: creating. A package: editing it. */
type Editing = AdPackageResponse | null | undefined

export function AdPackagesPage() {
  const { t } = useTranslation('admin')
  const packages = useAdPackages()
  const [editing, setEditing] = useState<Editing>(undefined)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('adPackages.title')}
        description={t('adPackages.description')}
        actions={
          <Button className="h-11 px-4" onClick={() => setEditing(null)}>
            <Plus aria-hidden />
            {t('adPackages.add')}
          </Button>
        }
      />
      <Card className="rounded-2xl p-2">
        {packages.isPending ? (
          <Skeleton className="h-40 w-full" aria-busy />
        ) : packages.isError ? (
          <QueryError error={packages.error} onRetry={() => void packages.refetch()} />
        ) : (
          <AdPackagesTable rows={packages.data} onEdit={setEditing} />
        )}
      </Card>
      {editing !== undefined && (
        <AdPackageDialog
          key={editing?.id ?? 'new'}
          open
          editing={editing}
          onOpenChange={(open) => !open && setEditing(undefined)}
        />
      )}
    </div>
  )
}
