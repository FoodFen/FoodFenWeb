import { fieldProps } from '@/components/field-props'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { crossesMidnight, type Shift } from '@/lib/opening-hours'
import { Moon, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
    <div className="space-y-1.5">
      <div className="flex items-start gap-2">
        {(['open', 'close'] as const).map((side) => (
          <div key={side} className="min-w-0 flex-1">
            <FormField id={`hours-${n}-${side}`} label={t(`hours.${side}`)} error={errors?.[side]}>
              <Input
                type="time"
                className="h-11"
                aria-label={t(`hours.${side}Named`, { n })}
                value={shift[side]}
                onChange={(event) => onChange({ ...shift, [side]: event.target.value })}
                {...fieldProps(`hours-${n}-${side}`, errors?.[side])}
              />
            </FormField>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-6 size-11 shrink-0"
          aria-label={t('hours.remove', { n })}
          disabled={!canRemove}
          onClick={onRemove}
        >
          <Trash2 aria-hidden />
        </Button>
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
