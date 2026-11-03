import type { FoodMissStatus } from '@/api/generated'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { FoodMissesTable } from './food-misses-table'
import { FoodPagedList } from './food-paged-list'
import type { FoodPrefill } from './food-schema'
import { missStatuses } from './food-search'
import { useFoodMisses, useIgnoreMiss, useReopenMiss } from './use-food-misses'

type Props = {
  status: FoodMissStatus
  onStatus: (status: FoodMissStatus) => void
  onAdd: (prefill: FoodPrefill) => void
}

/** What people searched for and the AI could not match to the catalog. */
export function FoodMissesTab({ status, onStatus, onAdd }: Props) {
  const { t } = useTranslation('admin')
  const list = useFoodMisses(status)
  const ignore = useIgnoreMiss()
  const reopen = useReopenMiss()

  return (
    <div className="space-y-6">
      <div
        role="group"
        aria-label={t('foods.misses.statusFilter')}
        className="flex flex-wrap gap-1.5"
      >
        {missStatuses.map((value) => (
          <Button
            key={value}
            variant={status === value ? 'default' : 'outline'}
            aria-pressed={status === value}
            onClick={() => onStatus(value)}
            className="h-11 px-4"
          >
            {t(`foods.misses.status.${value}`)}
          </Button>
        ))}
      </div>
      <FoodPagedList
        list={list}
        rowsOf={(page) => page.misses}
        totalLabel={(count) => t('foods.misses.total', { count })}
      >
        {(rows) => (
          <FoodMissesTable
            rows={rows}
            status={status}
            onAdd={onAdd}
            onIgnore={(id) => ignore.mutate({ path: { miss_id: id } })}
            onReopen={(id) => reopen.mutate({ path: { miss_id: id } })}
          />
        )}
      </FoodPagedList>
    </div>
  )
}
