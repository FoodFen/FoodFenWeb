import { fieldProps } from '@/components/field-props'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { crossesMidnight, type Shift } from '@/lib/opening-hours'
import { ArrowRight, Moon, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TimePicker } from './time-picker'

type Props = {
  /** 1-based position, used in the accessible names. */
  n: number
  shift: Shift
  errors?: { open?: string; close?: string }
  canRemove: boolean
  onChange: (shift: Shift) => void
  onRemove: () => void
}

export function ShiftRow({ n, shift, errors, canRemove, onChange, onRemove }: Props) {
  const { t } = useTranslation('restaurant')
  const overnight = shift.open !== '' && shift.close !== '' && crossesMidnight(shift)
  return (
    <div className="space-y-2 rounded-2xl border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{t('hours.shift', { n })}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="-my-1.5 size-11 shrink-0"
          aria-label={t('hours.remove', { n })}
          disabled={!canRemove}
          onClick={onRemove}
        >
          <Trash2 aria-hidden />
        </Button>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2">
        <ArrowRight
          className="text-muted-foreground col-start-2 row-start-1 mt-9 size-4"
          aria-hidden
        />
        {(['open', 'close'] as const).map((side) => (
          <div
            key={side}
            className={side === 'open' ? 'col-start-1 row-start-1' : 'col-start-3 row-start-1'}
          >
            <FormField id={`hours-${n}-${side}`} label={t(`hours.${side}`)} error={errors?.[side]}>
              <TimePicker
                aria-label={t(`hours.${side}Named`, { n })}
                value={shift[side]}
                onChange={(time) => onChange({ ...shift, [side]: time })}
                {...fieldProps(`hours-${n}-${side}`, errors?.[side])}
              />
            </FormField>
          </div>
        ))}
      </div>
      {overnight && (
        <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <Moon className="size-4 shrink-0" aria-hidden />
          {t('hours.overnight')}
        </p>
      )}
    </div>
  )
}
