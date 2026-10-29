import { Button } from '@/components/ui/button'
import type { Shift } from '@/lib/opening-hours'
import { useTranslation } from 'react-i18next'

const PRESETS = [
  { key: 'morning', open: '06:00', close: '10:00' },
  { key: 'noon', open: '10:30', close: '14:00' },
  { key: 'evening', open: '17:00', close: '22:00' },
  { key: 'allDay', open: '07:00', close: '22:00' },
] as const

type Props = { disabled: boolean; onPick: (shift: Shift) => void }

/** Common opening hours, one tap each. */
export function HoursPresets({ disabled, onPick }: Props) {
  const { t } = useTranslation('restaurant')
  return (
    <div role="group" aria-label={t('hours.presets')} className="flex flex-wrap gap-2">
      {PRESETS.map(({ key, open, close }) => (
        <Button
          key={key}
          type="button"
          variant="outline"
          className="h-11 px-3 tabular-nums"
          disabled={disabled}
          onClick={() => onPick({ open, close })}
        >
          {t(`hours.preset.${key}`)} {open}-{close}
        </Button>
      ))}
    </div>
  )
}
