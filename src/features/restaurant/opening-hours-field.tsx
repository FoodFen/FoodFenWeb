import { Button } from '@/components/ui/button'
import { MAX_SHIFTS } from '@/lib/opening-hours'
import { Plus } from 'lucide-react'
import { useController, useFormState, type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { RestaurantValues } from './restaurant-schema'
import { ShiftRow } from './shift-row'

type Props = { control: Control<RestaurantValues>; legacyHours: string }

const EMPTY_SHIFT = { open: '', close: '' }

/** One to three shifts, applied to every day of the week. */
export function OpeningHoursField({ control, legacyHours }: Props) {
  const { t } = useTranslation('restaurant')
  const { field } = useController({ control, name: 'hours' })
  const shifts = field.value
  const { errors } = useFormState({ control, name: 'hours' })

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">{t('form.openingHours')}</legend>
      <p className="text-muted-foreground text-sm">{t('form.openingHoursHint')}</p>
      {shifts.length === 0 ? (
        <div className="space-y-3">
          <p className="font-medium">{t('hours.current', { text: legacyHours })}</p>
          <p className="text-muted-foreground text-sm">{t('hours.legacyPrompt')}</p>
        </div>
      ) : (
        shifts.map((shift, i) => (
          <ShiftRow
            key={i}
            n={i + 1}
            shift={shift}
            errors={{
              open: errors.hours?.[i]?.open?.message,
              close: errors.hours?.[i]?.close?.message,
            }}
            canRemove={shifts.length > 1}
            onChange={(next) => field.onChange(shifts.map((s, j) => (j === i ? next : s)))}
            onRemove={() => field.onChange(shifts.filter((_, j) => j !== i))}
          />
        ))
      )}
      <Button
        type="button"
        variant="outline"
        className="h-11 px-4"
        disabled={shifts.length >= MAX_SHIFTS}
        onClick={() => field.onChange([...shifts, EMPTY_SHIFT])}
      >
        <Plus aria-hidden />
        {t(shifts.length === 0 ? 'hours.pick' : 'hours.add')}
      </Button>
    </fieldset>
  )
}
