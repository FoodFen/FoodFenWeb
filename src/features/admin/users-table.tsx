import type { AdminUserRowResponse } from '@/api/generated'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/format'
import { Flame, SearchX } from 'lucide-react'

const initials = (name: string) =>
  name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

export function UsersTable({ users }: { users: AdminUserRowResponse[] }) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <SearchX className="text-muted-foreground size-10" aria-hidden />
        <p className="font-medium">Không tìm thấy người dùng</p>
        <p className="text-muted-foreground text-sm">Thử đổi từ khóa hoặc bộ lọc gói.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Người dùng</TableHead>
          <TableHead>Gói</TableHead>
          <TableHead className="hidden md:table-cell">Chuỗi ngày</TableHead>
          <TableHead className="hidden lg:table-cell">Tham gia</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const name = user.displayName ?? user.email
          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="bg-secondary text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  >
                    {initials(name)}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="truncate">{name}</span>
                      {user.role === 'admin' && <Badge variant="outline">Quản trị</Badge>}
                    </span>
                    <span className="text-muted-foreground block truncate text-xs">
                      {user.email}
                    </span>
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {user.tier === 'premium' ? (
                  <Badge className="bg-cta/15 text-cta">Premium</Badge>
                ) : (
                  <Badge variant="secondary">Miễn phí</Badge>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="flex items-center gap-1.5 tabular-nums">
                  <Flame className="text-muted-foreground size-4" aria-hidden />
                  {user.streak} ngày
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground hidden tabular-nums lg:table-cell">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? 'outline' : 'secondary'}>
                  {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                </Badge>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
