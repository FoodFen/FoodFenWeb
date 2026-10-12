import type { AdPackageResponse } from '@/api/generated'
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
import { formatDate, formatVnd } from '@/lib/format'
import { Pencil, PackageOpen } from 'lucide-react'

type Props = { rows: AdPackageResponse[]; onEdit: (item: AdPackageResponse) => void }

export function AdPackagesTable({ rows, onEdit }: Props) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <PackageOpen className="text-muted-foreground size-10" aria-hidden />
        <p className="font-medium">Chưa có gói quảng cáo nào</p>
        <p className="text-muted-foreground text-sm">Nhấn Thêm gói để tạo gói đầu tiên.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Số ngày</TableHead>
          <TableHead>Giá</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
          <TableHead className="w-28">
            <span className="sr-only">Thao tác</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium tabular-nums">{item.days}</TableCell>
            <TableCell className="tabular-nums">{formatVnd(item.priceVnd)}</TableCell>
            <TableCell>
              <Badge variant={item.active ? 'default' : 'secondary'}>
                {item.active ? 'Đang bán' : 'Đã ẩn'}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground hidden tabular-nums md:table-cell">
              {formatDate(item.createdAt)}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                className="h-11 px-4"
                onClick={() => onEdit(item)}
                aria-label={`Sửa gói ${item.days} ngày`}
              >
                <Pencil aria-hidden />
                Sửa
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
