import { listPaymentsAdminPaymentsGetInfiniteOptions } from '@/api/generated/@tanstack/react-query.gen'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import type { PaymentsSearch } from './payments-search'

const PAGE_LIMIT = 20

export const useAdminPayments = (filters: PaymentsSearch) =>
  useInfiniteQuery({
    ...listPaymentsAdminPaymentsGetInfiniteOptions({ query: { ...filters, limit: PAGE_LIMIT } }),
    initialPageParam: '0',
    getNextPageParam: (last) => last.nextCursor,
    placeholderData: keepPreviousData,
  })
