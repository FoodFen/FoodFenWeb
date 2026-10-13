import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-mobile'
import { formatDay } from '@/lib/format'
import { enUS, vi } from 'date-fns/locale'
import { subMonths } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pickDay, toDate, toIso, vietnamToday, type DateRange } from './date-range'

const locales = { vi, en: enUS }

/** One trigger and one calendar: the first click sets an end, the second completes the range. */
export function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange
  onChange: (range: DateRange) => void
}) {
  const { t, i18n } = useTranslation('admin')
  const isMobile = useIsMobile()
  const id = useId()
  const labelId = `${id}-label`
  const valueId = `${id}-value`
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<string | null>(null)

  const today = toDate(vietnamToday())
  const selected = anchor
    ? { from: toDate(anchor), to: toDate(anchor) }
    : { from: toDate(value.from), to: toDate(value.to) }

  return (
    <div className="space-y-2">
      <Label id={labelId}>{t('dashboard.range.label')}</Label>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          setAnchor(null)
        }}
      >
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              aria-labelledby={`${labelId} ${valueId}`}
              className="h-11 gap-2 px-4"
            />
          }
        >
          <CalendarDays aria-hidden />
          <span id={valueId} className="tabular-nums">
            {formatDay(value.from)} - {formatDay(value.to)}
          </span>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto max-w-[calc(100vw-2rem)]">
          <Calendar
            mode="range"
            locale={locales[i18n.language as keyof typeof locales] ?? vi}
            numberOfMonths={isMobile ? 1 : 2}
            defaultMonth={isMobile ? selected.to : subMonths(selected.to, 1)}
            endMonth={today}
            disabled={{ after: today }}
            selected={selected}
            onSelect={(_, day) => {
              const pick = pickDay(anchor, toIso(day))
              setAnchor(pick.anchor)
              if (pick.range) {
                onChange(pick.range)
                setOpen(false)
              }
            }}
            labels={{
              labelPrevious: () => t('dashboard.range.previousMonth'),
              labelNext: () => t('dashboard.range.nextMonth'),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
