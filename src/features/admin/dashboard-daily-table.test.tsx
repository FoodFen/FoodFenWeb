import type { DashboardDayResponse, DashboardTotalsResponse } from '@/api/generated'
import { render, screen, within } from '@testing-library/react'
import { DashboardDailyTable } from './dashboard-daily-table'

const day = (date: string, premiumRevenue: number): DashboardDayResponse => ({
  date,
  premiumRevenue,
  adRevenue: 0,
  newUsers: 2,
  newRestaurants: 1,
  foodEntries: 5,
})

const totals = {
  premiumRevenue: 300000,
  adRevenue: 0,
  newUsers: 4,
  newRestaurants: 2,
  foodEntries: 10,
} as DashboardTotalsResponse

test('lists the days newest first and ends with the totals row', () => {
  render(
    <DashboardDailyTable
      daily={[day('2026-10-08', 100000), day('2026-10-09', 200000)]}
      totals={totals}
    />,
  )

  const rows = screen.getAllByRole('row')
  expect(within(rows[1]).getByText('09/10/2026')).toBeInTheDocument()
  expect(within(rows[1]).getByText('200.000 ₫')).toBeInTheDocument()
  expect(within(rows[2]).getByText('08/10/2026')).toBeInTheDocument()
  const last = rows[rows.length - 1]
  expect(within(last).getByText('Tổng')).toBeInTheDocument()
  expect(within(last).getByText('300.000 ₫')).toBeInTheDocument()
})
