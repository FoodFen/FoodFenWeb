import type { AdminFoodRowResponse } from '@/api/generated'
import { EmptyState } from '@/components/empty-state'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatNumber } from '@/lib/format'
import { BadgeCheck, SearchX, UtensilsCrossed } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Props = {
  rows: AdminFoodRowResponse[]
  /** A search or filter is active, so an empty list means no match rather than an empty catalog. */
  filtered: boolean
  onOpen: (slug: string) => void
}

export function FoodCatalogTable({ rows, filtered, onOpen }: Props) {
  const { t } = useTranslation('admin')
  if (rows.length === 0) {
    return filtered ? (
      <EmptyState icon={SearchX} title={t('foods.noMatch.title')} hint={t('foods.noMatch.hint')} />
    ) : (
      <EmptyState
        icon={UtensilsCrossed}
        title={t('foods.empty.title')}
        hint={t('foods.empty.hint')}
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('foods.columns.name')}</TableHead>
          <TableHead className="hidden md:table-cell">{t('foods.columns.category')}</TableHead>
          <TableHead>{t('foods.columns.kcal')}</TableHead>
          <TableHead>{t('foods.columns.source')}</TableHead>
          <TableHead className="hidden lg:table-cell">{t('foods.columns.updated')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((food) => (
          <TableRow key={food.slug} className="cursor-pointer" onClick={() => onOpen(food.slug)}>
            <TableCell className="w-full max-w-0">
              <button
                type="button"
                className="focus-visible:ring-ring/50 block max-w-full truncate rounded text-left font-medium outline-none focus-visible:ring-3"
              >
                {food.name}
              </button>
              {food.nameEn && (
                <span className="text-muted-foreground block truncate text-xs">{food.nameEn}</span>
              )}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {t(`foods.categories.${food.category}`)}
            </TableCell>
            <TableCell className="tabular-nums">{formatNumber(food.kcal)}</TableCell>
            <TableCell>
              {food.verified ? (
                <span
                  role="img"
                  aria-label={t(`foods.sources.${food.sourceKind}`)}
                  title={t(`foods.sources.${food.sourceKind}`)}
                  className="text-primary inline-flex"
                >
                  <BadgeCheck className="size-5" aria-hidden />
                </span>
              ) : (
                <Badge variant="secondary">{t('foods.sources.legacy')}</Badge>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground hidden tabular-nums lg:table-cell">
              {formatDate(food.updatedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
