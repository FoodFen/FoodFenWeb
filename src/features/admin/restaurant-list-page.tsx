import { QueryError } from '@/components/query-error'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { PageHeader } from './page-header'
import { RestaurantListTable } from './restaurant-list-table'
import { restaurantTabs, tabLabels, type RestaurantTab } from './restaurant-tabs'
import { useRestaurantList } from './use-moderation'

const route = getRouteApi('/_authed/admin/restaurants/')

export function RestaurantListPage() {
  const tab = route.useSearch({ select: (s) => s.tab ?? 'all' })
  const navigate = route.useNavigate()
  const openNavigate = useNavigate()
  const list = useRestaurantList(tab)
  const pendingCount = useRestaurantList('pending').data?.length ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý quán"
        description="Tất cả quán trên FoodFen và các yêu cầu chờ duyệt."
      />
      <Tabs
        value={tab}
        onValueChange={(value) =>
          void navigate({ search: { tab: value === 'all' ? undefined : (value as RestaurantTab) } })
        }
      >
        <TabsList>
          {restaurantTabs.map((value) => (
            <TabsTrigger key={value} value={value}>
              {tabLabels[value]}
              {value === 'pending' && pendingCount > 0 && <Badge>{pendingCount}</Badge>}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Card className="rounded-2xl p-2">
        {list.isPending ? (
          <Skeleton className="h-40 w-full" aria-busy />
        ) : list.isError ? (
          <QueryError error={list.error} onRetry={() => void list.refetch()} />
        ) : (
          <RestaurantListTable
            rows={list.data}
            tab={tab}
            onOpen={(restaurantId) =>
              void openNavigate({
                to: '/admin/restaurants/$restaurantId',
                params: { restaurantId },
              })
            }
          />
        )}
      </Card>
    </div>
  )
}
