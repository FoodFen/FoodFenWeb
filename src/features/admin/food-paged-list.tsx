import { QueryError } from '@/components/query-error'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type Props<P extends { total: number }, T> = {
  list: UseInfiniteQueryResult<InfiniteData<P>>
  rowsOf: (page: P) => T[]
  totalLabel: (count: number) => string
  children: (rows: T[]) => ReactNode
}

/** The total and a card holding the rows of a cursor-paged query, with its loading and error states and "Tải thêm". */
export function FoodPagedList<P extends { total: number }, T>({
  list,
  rowsOf,
  totalLabel,
  children,
}: Props<P, T>) {
  const { t } = useTranslation('admin')
  return (
    <>
      {list.data && list.data.pages[0].total > 0 && (
        <p className="text-muted-foreground text-sm tabular-nums">
          {totalLabel(list.data.pages[0].total)}
        </p>
      )}
      <Card className="rounded-2xl p-2">
        {list.isPending ? (
          <Skeleton className="h-40 w-full" aria-busy />
        ) : list.isError ? (
          <QueryError error={list.error} onRetry={() => void list.refetch()} />
        ) : (
          children(list.data.pages.flatMap(rowsOf))
        )}
      </Card>
      {list.hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="h-11 px-4"
            disabled={list.isFetchingNextPage}
            onClick={() => void list.fetchNextPage()}
          >
            {t('foods.loadMore')}
          </Button>
        </div>
      )}
    </>
  )
}
