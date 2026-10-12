import type { AdPackageResponse } from '@/api/generated'
import { QueryError } from '@/components/query-error'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { AdPackageDialog } from './ad-package-dialog'
import { AdPackagesTable } from './ad-packages-table'
import { PageHeader } from './page-header'
import { useAdPackages } from './use-ad-packages'

/** `undefined`: dialog closed. `null`: creating. A package: editing it. */
type Editing = AdPackageResponse | null | undefined

export function AdPackagesPage() {
  const packages = useAdPackages()
  const [editing, setEditing] = useState<Editing>(undefined)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gói quảng cáo"
        description="Các gói chủ quán có thể mua để quán được tài trợ trong ứng dụng."
        actions={
          <Button className="h-11 px-4" onClick={() => setEditing(null)}>
            <Plus aria-hidden />
            Thêm gói
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
