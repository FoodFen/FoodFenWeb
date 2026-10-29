import { SearchInput } from '@/components/search-input'
import { useDebouncedInput } from '@/hooks/use-debounced-input'
import { useTranslation } from 'react-i18next'
import { DateRangePicker } from './date-range-picker'
import { FilterSelect } from './filter-select'
import {
  paymentProviders,
  paymentStatuses,
  planTypes,
  type PaymentsSearch,
} from './payments-search'

export function PaymentsToolbar({
  search,
  onChange,
}: {
  search: PaymentsSearch
  onChange: (patch: PaymentsSearch) => void
}) {
  const { t } = useTranslation('admin')
  const [text, setText] = useDebouncedInput(search.q ?? '', (q) => onChange({ q: q || undefined }))
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">
      <SearchInput
        className="col-span-2 sm:max-w-xs"
        value={text}
        onChange={setText}
        placeholder={t('payments.searchPlaceholder')}
        label={t('payments.searchLabel')}
      />
      <FilterSelect
        label={t('payments.columns.status')}
        anyLabel={t('payments.any')}
        value={search.status}
        options={paymentStatuses.map((value) => ({ value, label: t(`payments.status.${value}`) }))}
        onChange={(status) => onChange({ status })}
      />
      <FilterSelect
        label={t('payments.columns.plan')}
        anyLabel={t('payments.any')}
        value={search.planType}
        options={planTypes.map((value) => ({ value, label: t(`payments.plan.${value}`) }))}
        onChange={(planType) => onChange({ planType })}
      />
      <FilterSelect
        label={t('payments.columns.provider')}
        anyLabel={t('payments.any')}
        value={search.provider}
        options={paymentProviders.map((value) => ({
          value,
          label: t(`payments.provider.${value}`),
        }))}
        onChange={(provider) => onChange({ provider })}
      />
      <DateRangePicker
        value={search.from && search.to ? { from: search.from, to: search.to } : null}
        onChange={({ from, to }) => onChange({ from, to })}
        onClear={() => onChange({ from: undefined, to: undefined })}
      />
    </div>
  )
}
