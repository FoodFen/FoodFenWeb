import { SearchInput } from '@/components/search-input'
import { SwitchInput } from '@/components/switch-input'
import { Button } from '@/components/ui/button'
import { useDebouncedInput } from '@/hooks/use-debounced-input'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { foodCategories } from './food-categories'
import type { FoodSearch } from './food-search'
import { FilterSelect } from './filter-select'

type Props = {
  search: FoodSearch
  onChange: (patch: FoodSearch) => void
  onAdd: () => void
}

const sourceValues = ['yes', 'no'] as const

export function FoodCatalogToolbar({ search, onChange, onAdd }: Props) {
  const { t } = useTranslation('admin')
  const [text, setText] = useDebouncedInput(search.q ?? '', (q) => onChange({ q: q || undefined }))
  const verified = search.verified === undefined ? undefined : search.verified ? 'yes' : 'no'

  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">
      <SearchInput
        className="col-span-2 sm:max-w-xs"
        value={text}
        onChange={setText}
        placeholder={t('foods.searchPlaceholder')}
        label={t('foods.searchLabel')}
      />
      <FilterSelect
        label={t('foods.filters.category')}
        anyLabel={t('foods.filters.any')}
        value={search.category}
        options={foodCategories.map((value) => ({ value, label: t(`foods.categories.${value}`) }))}
        onChange={(category) => onChange({ category })}
      />
      <FilterSelect
        label={t('foods.filters.source')}
        anyLabel={t('foods.filters.any')}
        value={verified}
        options={sourceValues.map((value) => ({
          value,
          label: t(`foods.filters.verified.${value}`),
        }))}
        onChange={(value) =>
          onChange({ verified: value === undefined ? undefined : value === 'yes' })
        }
      />
      <label className="col-span-2 flex h-11 items-center gap-3 text-sm sm:col-span-1">
        <SwitchInput
          checked={search.archived === true}
          onChange={(event) => onChange({ archived: event.target.checked || undefined })}
        />
        {t('foods.filters.archived')}
      </label>
      <Button className="col-span-2 h-11 px-4 sm:col-span-1 sm:ml-auto" onClick={onAdd}>
        <Plus aria-hidden />
        {t('foods.add')}
      </Button>
    </div>
  )
}
