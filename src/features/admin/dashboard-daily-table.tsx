import type { DashboardDayResponse, DashboardTotalsResponse } from '@/api/generated'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDay, formatNumber, formatVnd } from '@/lib/format'
import { useTranslation } from 'react-i18next'

const num = 'text-right tabular-nums'

/** One row per day, newest first, with the range totals underneath. */
export function DashboardDailyTable({
  daily,
  totals,
}: {
  daily: DashboardDayResponse[]
  totals: DashboardTotalsResponse
}) {
  const { t } = useTranslation('admin')
  const rows = daily.toSorted((a, b) => b.date.localeCompare(a.date))
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{t('dashboard.daily.title')}</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('dashboard.daily.date')}</TableHead>
              <TableHead className={num}>{t('dashboard.stats.premiumRevenue')}</TableHead>
              <TableHead className={num}>{t('dashboard.stats.adRevenue')}</TableHead>
              <TableHead className={num}>{t('dashboard.stats.newUsers')}</TableHead>
              <TableHead className={num}>{t('dashboard.stats.newRestaurants')}</TableHead>
              <TableHead className={num}>{t('dashboard.stats.foodEntries')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((day) => (
              <TableRow key={day.date}>
                <TableCell className="tabular-nums">{formatDay(day.date)}</TableCell>
                <TableCell className={num}>{formatVnd(day.premiumRevenue)}</TableCell>
                <TableCell className={num}>{formatVnd(day.adRevenue)}</TableCell>
                <TableCell className={num}>{formatNumber(day.newUsers)}</TableCell>
                <TableCell className={num}>{formatNumber(day.newRestaurants)}</TableCell>
                <TableCell className={num}>{formatNumber(day.foodEntries)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableHead>{t('dashboard.daily.total')}</TableHead>
              <TableCell className={num}>{formatVnd(totals.premiumRevenue)}</TableCell>
              <TableCell className={num}>{formatVnd(totals.adRevenue)}</TableCell>
              <TableCell className={num}>{formatNumber(totals.newUsers)}</TableCell>
              <TableCell className={num}>{formatNumber(totals.newRestaurants)}</TableCell>
              <TableCell className={num}>{formatNumber(totals.foodEntries)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
