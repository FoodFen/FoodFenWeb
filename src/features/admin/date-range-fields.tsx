import { FormField } from '@/components/form-field'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'

export type DateRange = { from: string; to: string }

/** Native date inputs, so the browser supplies the picker. Values are YYYY-MM-DD. */
export function DateRangeFields({
  value,
  onChange,
}: {
  value: DateRange
  onChange: (range: DateRange) => void
}) {
  const { t } = useTranslation('admin')
  return (
    <div className="flex flex-wrap gap-4">
      <FormField id="range-from" label={t('dashboard.from')}>
        <Input
          id="range-from"
          type="date"
          className="h-11"
          value={value.from}
          max={value.to}
          onChange={(event) =>
            event.target.value && onChange({ ...value, from: event.target.value })
          }
        />
      </FormField>
      <FormField id="range-to" label={t('dashboard.to')}>
        <Input
          id="range-to"
          type="date"
          className="h-11"
          value={value.to}
          min={value.from}
          onChange={(event) => event.target.value && onChange({ ...value, to: event.target.value })}
        />
      </FormField>
    </div>
  )
}
