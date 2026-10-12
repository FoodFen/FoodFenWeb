import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import { PageHeader } from './page-header'
import { QueryError } from '@/components/query-error'
import { useAdminUsers } from './use-admin-users'
import { UsersTable } from './users-table'
import { UsersToolbar, type TierFilter } from './users-toolbar'

export function UsersPage() {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [tier, setTier] = useState<TierFilter>('all')

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(timer)
  }, [query])

  const users = useAdminUsers(debounced, tier === 'all' ? undefined : tier)
  const rows = users.data?.pages.flatMap((page) => page.users) ?? []

  return (
    <div className="space-y-6">
      <PageHeader title="Người dùng" description="Tìm kiếm tài khoản người dùng." />
      <UsersToolbar query={query} onQuery={setQuery} tier={tier} onTier={setTier} />
      <Card className="rounded-2xl p-2">
        {users.isPending ? (
          <Skeleton className="h-40 w-full" aria-busy />
        ) : users.isError ? (
          <QueryError error={users.error} onRetry={() => void users.refetch()} />
        ) : (
          <UsersTable users={rows} />
        )}
      </Card>
      {users.data && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            Hiển thị {rows.length} trên {users.data.pages[0].total} người dùng
          </p>
          {users.hasNextPage && (
            <Button
              variant="outline"
              className="h-11 px-4"
              disabled={users.isFetchingNextPage}
              onClick={() => void users.fetchNextPage()}
            >
              Tải thêm
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
