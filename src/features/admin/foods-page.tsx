import { PageHeader } from '@/components/page-header'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FoodCatalogTab } from './food-catalog-tab'
import { FoodDialog } from './food-dialog'
import { FoodMissesTab } from './food-misses-tab'
import type { FoodPrefill } from './food-schema'
import { foodTabs, type FoodSearch, type FoodTab } from './food-search'

const route = getRouteApi('/_authed/admin/foods')

export function FoodsPage() {
  const { t } = useTranslation('admin')
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const tab = search.tab ?? 'catalog'
  /** `null`: no create dialog. Otherwise the dialog, starting from the prefill. */
  const [creating, setCreating] = useState<FoodPrefill | null>(null)
  const go = (patch: FoodSearch) =>
    void navigate({ search: (previous) => ({ ...previous, ...patch }) })

  return (
    <div className="space-y-6">
      <PageHeader title={t('foods.title')} description={t('foods.description')} />
      <Tabs
        value={tab}
        onValueChange={(value) =>
          void navigate({ search: { tab: value === 'catalog' ? undefined : (value as FoodTab) } })
        }
      >
        <TabsList>
          {foodTabs.map((value) => (
            <TabsTrigger key={value} value={value}>
              {t(`foods.tabs.${value}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {tab === 'catalog' ? (
        <FoodCatalogTab
          search={search}
          onChange={go}
          onOpen={(food) => go({ food })}
          onAdd={() => setCreating({})}
        />
      ) : (
        <FoodMissesTab
          status={search.status ?? 'open'}
          onStatus={(status) => go({ status: status === 'open' ? undefined : status })}
          onAdd={setCreating}
        />
      )}
      {creating && <FoodDialog slug={null} prefill={creating} onClose={() => setCreating(null)} />}
      {search.food && (
        <FoodDialog key={search.food} slug={search.food} onClose={() => go({ food: undefined })} />
      )}
    </div>
  )
}
