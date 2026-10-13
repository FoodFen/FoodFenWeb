import type { AdminRestaurantRowResponse } from '@/api/generated'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CircleCheck, Eye } from 'lucide-react'
import { emptyMessages, type RestaurantTab } from './restaurant-tabs'

type Props = {
  rows: AdminRestaurantRowResponse[]
  tab: RestaurantTab
  onOpen: (id: string) => void
}

export function RestaurantListTable({ rows, tab, onOpen }: Props) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <CircleCheck className="text-muted-foreground size-10" aria-hidden />
        <p className="font-medium">Chưa có quán nào ở mục này</p>
        <p className="text-muted-foreground text-sm">{emptyMessages[tab]}</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Quán</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="hidden md:table-cell">Món chờ duyệt</TableHead>
          <TableHead className="hidden lg:table-cell">Cập nhật</TableHead>
          <TableHead className="w-28">
            <span className="sr-only">Thao tác</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <span className="block truncate font-medium">{row.name}</span>
              <span className="text-muted-foreground block truncate text-xs">
                {row.ownerName ? `${row.ownerName}, ${row.ownerEmail}` : row.ownerEmail}
              </span>
            </TableCell>
            <TableCell>
              <StatusBadge status={row.status} />
            </TableCell>
            <TableCell className="hidden tabular-nums md:table-cell">
              {row.pendingDishCount} / {row.dishCount}
            </TableCell>
            <TableCell className="text-muted-foreground hidden tabular-nums lg:table-cell">
              {new Date(row.updatedAt).toLocaleDateString('vi-VN')}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                className="h-11 px-4"
                onClick={() => onOpen(row.id)}
                aria-label={`Xem ${row.name}`}
              >
                <Eye aria-hidden />
                Xem
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
