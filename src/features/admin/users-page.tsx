import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { fold } from '@/lib/text'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { users } from './mock-users'
import { PageHeader } from './page-header'
import { UsersTable } from './users-table'
import { UsersToolbar, type TierFilter } from './users-toolbar'

export function UsersPage() {
  const [query, setQuery] = useState('')
  const [tier, setTier] = useState<TierFilter>('all')

  const needle = fold(query.trim())
  const visible = users.filter(
    (u) =>
      (tier === 'all' || u.tier === tier) &&
      (!needle || fold(u.name).includes(needle) || fold(u.email).includes(needle)),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Người dùng"
        description="Tìm kiếm và quản lý tài khoản người dùng."
        actions={
          <Button variant="outline" className="h-11 px-4">
            <Download aria-hidden />
            Xuất CSV
          </Button>
        }
      />
      <UsersToolbar query={query} onQuery={setQuery} tier={tier} onTier={setTier} />
      <Card className="rounded-2xl p-2">
        <UsersTable users={visible} />
      </Card>
      <p className="text-muted-foreground text-sm">
        Hiển thị {visible.length} trên {users.length} người dùng
      </p>
    </div>
  )
}
