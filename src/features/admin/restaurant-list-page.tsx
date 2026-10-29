import { QueryError } from '@/components/query-error'
import { SearchInput } from '@/components/search-input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDebouncedInput } from '@/hooks/use-debounced-input'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/page-header'
import { ListPager } from './list-pager'
import { filterRestaurants, paginate } from './restaurant-filter'
import { RestaurantListTable } from './restaurant-list-table'
import { restaurantTabs, type RestaurantSearch, type RestaurantTab } from './restaurant-tabs'
import { useRestaurantList } from './use-moderation'

const route = getRouteApi('/_authed/admin/restaurants/')

export function RestaurantListPage() {
  const { t } = useTranslation(['admin', 'common'])
  const { tab: tabParam, q = '', page: pageParam = 1 } = route.useSearch()
  const tab = tabParam ?? 'all'
  const navigate = route.useNavigate()
  const openNavigate = useNavigate()
  const list = useRestaurantList(tab)
  const pendingCount = useRestaurantList('pending').data?.length ?? 0
  // Tab and query changes go back to page 1 because `page` is dropped from the URL.
  const go = (search: RestaurantSearch) => void navigate({ search })
  const [text, setText] = useDebouncedInput(q, (value) =>
    go({ tab: tabParam, q: value || undefined }),
  )
  const filtered = useMemo(() => filterRestaurants(list.data ?? [], q), [list.data, q])
  const { items, page, pageCount, total } = paginate(filtered, pageParam)

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
      <Card className="rounded-2xl p-2">
        {list.isPending ? (
          <Skeleton className="h-40 w-full" aria-busy />
        ) : list.isError ? (
          <QueryError error={list.error} onRetry={() => void list.refetch()} />
        ) : (
          <RestaurantListTable
            rows={items}
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
      {list.data && (
        <ListPager
          page={page}
          pageCount={pageCount}
          total={total}
          totalLabel={t('restaurants.total', { count: total })}
          onPage={(next) =>
            go({ tab: tabParam, q: q || undefined, page: next > 1 ? next : undefined })
          }
        />
      )}
    </div>
  )
}
