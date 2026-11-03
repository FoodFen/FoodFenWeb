import { QueryError } from '@/components/query-error'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { FoodPage } from './food-types'

type Props<T> = {
  list: UseInfiniteQueryResult<InfiniteData<FoodPage<T>>>
  children: (rows: T[]) => ReactNode
}

/** A card holding the rows of a cursor-paged query, with its loading and error states and "Tải thêm". */
export function FoodPagedList<T>({ list, children }: Props<T>) {
  const { t } = useTranslation('admin')
  return (
    <>
      <Card className="rounded-2xl p-2">
        {list.isPending ? (
          <Skeleton className="h-40 w-full" aria-busy />
        ) : list.isError ? (
          <QueryError error={list.error} onRetry={() => void list.refetch()} />
        ) : (
          children(list.data.pages.flatMap((page) => page.items))
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
