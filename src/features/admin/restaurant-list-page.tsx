import { QueryError } from '@/components/query-error'
import { SearchInput } from '@/components/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDebouncedInput } from '@/hooks/use-debounced-input'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/page-header'
import { RestaurantListTable } from './restaurant-list-table'
import { restaurantTabs, type RestaurantSearch, type RestaurantTab } from './restaurant-tabs'
import { useAdminRestaurants } from './use-admin-restaurants'

const route = getRouteApi('/_authed/admin/restaurants/')

export function RestaurantListPage() {
  const { t } = useTranslation(['admin', 'common'])
  const { tab: tabParam, q = '' } = route.useSearch()
  const tab = tabParam ?? 'all'
  const navigate = route.useNavigate()
  const openNavigate = useNavigate()
  const list = useAdminRestaurants(tab, q)
  const pendingCount = useAdminRestaurants('pending').data?.pages[0].total ?? 0
  const rows = list.data?.pages.flatMap((page) => page.restaurants) ?? []
  const go = (search: RestaurantSearch) => void navigate({ search })
  const [text, setText] = useDebouncedInput(q, (value) =>
    go({ tab: tabParam, q: value || undefined }),
  )

  return (
    <div className="space-y-6">
      <PageHeader title={t('restaurants.title')} description={t('restaurants.description')} />
      <Tabs
        value={tab}
        onValueChange={(value) =>
          go({ tab: value === 'all' ? undefined : (value as RestaurantTab), q: q || undefined })
        }
      >
        <TabsList>
          {restaurantTabs.map((value) => (
            <TabsTrigger key={value} value={value}>
              {value === 'all' ? t('restaurants.allTab') : t(`common:status.${value}`)}
              {value === 'pending' && pendingCount > 0 && <Badge>{pendingCount}</Badge>}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <SearchInput
        className="sm:max-w-sm"
        value={text}
        onChange={setText}
        placeholder={t('restaurants.searchPlaceholder')}
        label={t('restaurants.searchLabel')}
      />
      {list.data && list.data.pages[0].total > 0 && (
        <p className="text-muted-foreground text-sm tabular-nums">
          {t('restaurants.total', { count: list.data.pages[0].total })}
        </p>
      )}
      <Card className="rounded-2xl p-2">
        {list.isPending ? (
          <Skeleton className="h-40 w-full" aria-busy />
        ) : list.isError ? (
          <QueryError error={list.error} onRetry={() => void list.refetch()} />
        ) : (
          <RestaurantListTable
            rows={rows}
            tab={tab}
            searching={q !== ''}
            onOpen={(restaurantId) =>
              void openNavigate({
                to: '/admin/restaurants/$restaurantId',
                params: { restaurantId },
              })
            }
          />
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
            {t('restaurants.loadMore')}
          </Button>
        </div>
      )}
    </div>
  )
}
