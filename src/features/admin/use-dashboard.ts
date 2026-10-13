import { dashboardAdminDashboardGetOptions } from '@/api/generated/@tanstack/react-query.gen'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { DateRange } from './date-range'

/** `null` asks for the BE default: the last 30 Vietnam days ending today. */
export const useDashboard = (range: DateRange | null) =>
  useQuery({
    ...dashboardAdminDashboardGetOptions(range ? { query: range } : undefined),
    placeholderData: keepPreviousData,
  })
