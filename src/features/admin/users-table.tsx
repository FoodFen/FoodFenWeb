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
import { useTranslation } from 'react-i18next'

const initials = (name: string) =>
  name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

export function UsersTable({ users }: { users: AdminUserRowResponse[] }) {
  const { t } = useTranslation('admin')
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <SearchX className="text-muted-foreground size-10" aria-hidden />
        <p className="font-medium">{t('users.empty.title')}</p>
        <p className="text-muted-foreground text-sm">{t('users.empty.hint')}</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('users.columns.user')}</TableHead>
          <TableHead>{t('users.columns.tier')}</TableHead>
          <TableHead className="hidden md:table-cell">{t('users.columns.streak')}</TableHead>
          <TableHead className="hidden lg:table-cell">{t('users.columns.joined')}</TableHead>
          <TableHead>{t('table.status')}</TableHead>
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
                      {user.role === 'admin' && <Badge variant="outline">{t('users.admin')}</Badge>}
                    </span>
                    <span className="text-muted-foreground block truncate text-xs">
                      {user.email}
                    </span>
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {user.tier === 'premium' ? (
                  <Badge className="bg-cta/15 text-cta">{t('users.tiers.premium')}</Badge>
                ) : (
                  <Badge variant="secondary">{t('users.tiers.free')}</Badge>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="flex items-center gap-1.5 tabular-nums">
                  <Flame className="text-muted-foreground size-4" aria-hidden />
                  {t('days', { count: user.streak })}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground hidden tabular-nums lg:table-cell">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? 'outline' : 'secondary'}>
                  {user.isActive ? t('users.active') : t('users.locked')}
                </Badge>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
