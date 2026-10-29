import { PageHeader } from '@/components/page-header'
import { QueryError } from '@/components/query-error'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PaymentsTable } from './payments-table'
import { PaymentsToolbar } from './payments-toolbar'
import { useAdminPayments } from './use-admin-payments'

const route = getRouteApi('/_authed/admin/payments')

export function PaymentsPage() {
  const { t } = useTranslation('admin')
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const payments = useAdminPayments(search)
  const rows = payments.data?.pages.flatMap((page) => page.payments) ?? []

  return (
    <div className="space-y-6">
      <PageHeader title={t('payments.title')} description={t('payments.description')} />
      <PaymentsToolbar
        search={search}
        onChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }) })}
      />
      {payments.data && (
        <p className="text-muted-foreground text-sm tabular-nums">
          {t('payments.total', { count: payments.data.pages[0].total })}
        </p>
      )}
      <Card className="rounded-2xl p-2">
        {payments.isPending ? (
          <Skeleton className="h-40 w-full" aria-busy />
        ) : payments.isError ? (
          <QueryError error={payments.error} onRetry={() => void payments.refetch()} />
        ) : (
          <PaymentsTable payments={rows} />
        )}
      </Card>
      {payments.hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="h-11 px-4"
            disabled={payments.isFetchingNextPage}
            onClick={() => void payments.fetchNextPage()}
          >
            {t('payments.loadMore')}
          </Button>
        </div>
      )}
    </div>
  )
}
