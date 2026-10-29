import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Clock } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { TimeColumn } from './time-column'

const HOURS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']

type Props = Omit<ComponentProps<'button'>, 'value' | 'onChange'> & {
  /** "HH:MM", or "" while nothing is picked. */
  value: string
  onChange: (value: string) => void
}

/** Hour and quarter-hour columns in a popover; `button` props (id, aria-*) go to the trigger. */
export function TimePicker({ value, onChange, ...trigger }: Props) {
  const { t } = useTranslation('restaurant')
  const [open, setOpen] = useState(false)
  const [hour = '', minute = ''] = value.split(':')
  // Saved times may sit off the quarter hour (10:20); keep that minute selectable.
  const minutes = [...new Set([...MINUTES, ...(minute ? [minute] : [])])].sort()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="h-11 w-full justify-start gap-2 px-3 font-normal tabular-nums"
            {...trigger}
          />
        }
      >
        <Clock className="text-muted-foreground" aria-hidden />
        {value || <span className="text-muted-foreground">{t('hours.timePlaceholder')}</span>}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto">
        <div className="flex gap-2">
          <TimeColumn
            label={t('hours.hourColumn')}
            items={HOURS}
            selected={hour}
            onSelect={(h) => onChange(`${h}:${minute || '00'}`)}
          />
          <TimeColumn
            label={t('hours.minuteColumn')}
            items={minutes}
            selected={minute}
            onSelect={(m) => {
              onChange(`${hour || '00'}:${m}`)
              setOpen(false)
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
