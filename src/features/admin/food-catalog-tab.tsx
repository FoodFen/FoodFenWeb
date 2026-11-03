import { useTranslation } from 'react-i18next'
import { FoodCatalogTable } from './food-catalog-table'
import { FoodCatalogToolbar } from './food-catalog-toolbar'
import { FoodPagedList } from './food-paged-list'
import type { FoodSearch } from './food-search'
import { useAdminFoods } from './use-foods'

type Props = {
  search: FoodSearch
  onChange: (patch: FoodSearch) => void
  onOpen: (slug: string) => void
  onAdd: () => void
}

export function FoodCatalogTab({ search, onChange, onOpen, onAdd }: Props) {
  const { t } = useTranslation('admin')
  const { q, category, verified, archived } = search
  const list = useAdminFoods({ q, category, verified, archived })
  const filtered = !!q || category !== undefined || verified !== undefined || archived === true

  return (
    <div className="space-y-6">
      <FoodCatalogToolbar search={search} onChange={onChange} onAdd={onAdd} />
      <FoodPagedList
        list={list}
        rowsOf={(page) => page.foods}
        totalLabel={(count) => t('foods.total', { count })}
      >
        {(rows) => <FoodCatalogTable rows={rows} filtered={filtered} onOpen={onOpen} />}
      </FoodPagedList>
    </div>
  )
}
