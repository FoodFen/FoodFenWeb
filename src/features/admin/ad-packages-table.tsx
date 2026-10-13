import type { AdPackageResponse } from '@/api/generated'
import { EmptyState } from '@/components/empty-state'
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
import { useTranslation } from 'react-i18next'

type Props = { rows: AdPackageResponse[]; onEdit: (item: AdPackageResponse) => void }

export function AdPackagesTable({ rows, onEdit }: Props) {
  const { t } = useTranslation('admin')
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={PackageOpen}
        title={t('adPackages.empty.title')}
        hint={t('adPackages.empty.hint')}
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('adPackages.columns.days')}</TableHead>
          <TableHead>{t('adPackages.columns.price')}</TableHead>
          <TableHead>{t('table.status')}</TableHead>
          <TableHead className="hidden md:table-cell">{t('adPackages.columns.created')}</TableHead>
          <TableHead className="w-28">
            <span className="sr-only">{t('table.actions')}</span>
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
                {item.active ? t('adPackages.onSale') : t('adPackages.hidden')}
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
                aria-label={t('adPackages.editNamed', { days: item.days })}
              >
                <Pencil aria-hidden />
                {t('adPackages.edit')}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
