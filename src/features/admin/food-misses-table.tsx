import { EmptyState } from '@/components/empty-state'
import { Badge, badgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime } from '@/lib/format'
import { Link } from '@tanstack/react-router'
import { Plus, RotateCcw, Sparkles, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FoodPrefill } from './food-schema'
import type { FoodMiss, FoodMissStatus } from './food-types'

type Props = {
  rows: FoodMiss[]
  status: FoodMissStatus
  onAdd: (prefill: FoodPrefill) => void
  onIgnore: (id: string) => void
  onReopen: (id: string) => void
}

/** The miss's text lands in the field of the language it was typed in. */
const prefillOf = ({ id, name, language }: FoodMiss): FoodPrefill =>
  language === 'vi' ? { missId: id, name } : { missId: id, nameEn: name }

export function FoodMissesTable({ rows, status, onAdd, onIgnore, onReopen }: Props) {
  const { t } = useTranslation('admin')
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title={t('foods.misses.empty.title')}
        hint={t(`foods.misses.empty.${status}`)}
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('foods.misses.columns.name')}</TableHead>
          <TableHead>{t('foods.misses.columns.count')}</TableHead>
          <TableHead className="hidden md:table-cell">
            {t('foods.misses.columns.lastSeen')}
          </TableHead>
          <TableHead>
            <span className="sr-only">{t('table.actions')}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((miss) => (
          <TableRow key={miss.id}>
            <TableCell className="w-full max-w-0">
              <span className="flex items-center gap-2">
                <span className="truncate font-medium">{miss.name}</span>
                {miss.language !== 'vi' && <Badge variant="outline">EN</Badge>}
              </span>
              {miss.existingFood && (
                <Link
                  to="/admin/foods"
                  search={{ food: miss.existingFood.slug }}
                  className={`${badgeVariants({ variant: 'secondary' })} mt-1 max-w-full`}
                >
                  <span className="truncate">
                    {t('foods.misses.existing', { name: miss.existingFood.name })}
                  </span>
                </Link>
              )}
            </TableCell>
            <TableCell className="tabular-nums">{miss.count}</TableCell>
            <TableCell className="text-muted-foreground hidden tabular-nums md:table-cell">
              {formatDateTime(miss.lastSeenAt)}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                {miss.status === 'open' ? (
                  <>
                    {!miss.existingFood && (
                      <Button
                        className="h-11 px-4"
                        aria-label={t('foods.misses.addNamed', { name: miss.name })}
                        onClick={() => onAdd(prefillOf(miss))}
                      >
                        <Plus aria-hidden />
                        {t('foods.add')}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="h-11 px-4"
                      aria-label={t('foods.misses.ignoreNamed', { name: miss.name })}
                      onClick={() => onIgnore(miss.id)}
                    >
                      <X aria-hidden />
                      {t('foods.misses.ignore')}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="h-11 px-4"
                    aria-label={t('foods.misses.reopenNamed', { name: miss.name })}
                    onClick={() => onReopen(miss.id)}
                  >
                    <RotateCcw aria-hidden />
                    {t('foods.misses.reopen')}
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
