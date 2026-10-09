import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Ellipsis, Flame, SearchX } from 'lucide-react'
import type { AdminUser } from './mock-users'

const initials = (name: string) =>
  name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')

export function UsersTable({ users }: { users: AdminUser[] }) {
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
          <TableHead className="w-12">
            <span className="sr-only">Thao tác</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="bg-secondary text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                >
                  {initials(user.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground block truncate text-xs">{user.email}</span>
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
              {new Date(user.joinedAt).toLocaleDateString('vi-VN')}
            </TableCell>
            <TableCell>
              <Badge variant={user.active ? 'outline' : 'secondary'}>
                {user.active ? 'Hoạt động' : 'Tạm khóa'}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" aria-label={`Thao tác với ${user.name}`}>
                <Ellipsis aria-hidden />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
