import { cn } from 'cn'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, getDefaultClassNames, type DayButton } from 'react-day-picker'

import { Button, buttonVariants } from '@/components/ui/button'

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames()
  const nav = cn(
    buttonVariants({ variant: 'ghost' }),
    'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
  )

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(11)] in-data-[slot=popover-content]:bg-transparent',
        className,
      )}
      classNames={{
        root: cn('w-fit', defaults.root),
        months: cn('relative flex flex-col gap-4 md:flex-row', defaults.months),
        month: cn('flex w-full flex-col gap-2', defaults.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaults.nav,
        ),
        button_previous: cn(nav, defaults.button_previous),
        button_next: cn(nav, defaults.button_next),
        month_caption: cn(
          'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
          defaults.month_caption,
        ),
        caption_label: cn('text-sm font-medium capitalize select-none', defaults.caption_label),
        month_grid: cn('w-full border-collapse', defaults.month_grid),
        weekdays: cn('flex', defaults.weekdays),
        weekday: cn(
          'text-muted-foreground flex-1 text-[0.8rem] font-normal select-none',
          defaults.weekday,
        ),
        week: cn('mt-1 flex w-full', defaults.week),
        day: cn(
          'group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none',
          defaults.day,
        ),
        range_start: cn(
          'bg-muted after:bg-muted relative isolate z-0 rounded-l-(--cell-radius) after:absolute after:inset-y-0 after:right-0 after:w-4',
          defaults.range_start,
        ),
        range_middle: cn('rounded-none', defaults.range_middle),
        range_end: cn(
          'bg-muted after:bg-muted relative isolate z-0 rounded-r-(--cell-radius) after:absolute after:inset-y-0 after:left-0 after:w-4',
          defaults.range_end,
        ),
        today: cn('text-primary font-semibold', defaults.today),
        outside: cn('text-muted-foreground', defaults.outside),
        disabled: cn('text-muted-foreground opacity-40', defaults.disabled),
        hidden: cn('invisible', defaults.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...rest }) => (
          <div data-slot="calendar" ref={rootRef} className={className} {...rest} />
        ),
        Chevron: ({ className, orientation }) => {
          const Icon =
            orientation === 'left'
              ? ChevronLeft
              : orientation === 'right'
                ? ChevronRight
                : ChevronDown
          return <Icon className={cn('size-4', className)} aria-hidden />
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day: _day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaults = getDefaultClassNames()
  return (
    <Button
      variant="ghost"
      size="icon"
      ref={(node) => {
        if (modifiers.focused) node?.focus()
      }}
      className={cn(
        'group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col border-0 leading-none font-normal tabular-nums group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px]',
        modifiers.range_middle && 'text-foreground bg-muted rounded-none',
        (modifiers.range_start ||
          modifiers.range_end ||
          (modifiers.selected && !modifiers.range_middle)) &&
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-(--cell-radius)',
        defaults.day,
        className,
      )}
      {...props}
    />
  )
}

export { Calendar }
