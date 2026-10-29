import { cn } from 'cn'
import { useEffect, useRef, type KeyboardEvent } from 'react'

type Props = {
  label: string
  items: string[]
  selected: string
  onSelect: (item: string) => void
}

/** One scrollable listbox of a time picker; arrow keys move focus, Enter or Space selects. */
export function TimeColumn({ label, items, selected, onSelect }: Props) {
  const list = useRef<HTMLDivElement>(null)

  // Centre the selected item by scrolling the list itself, never the page behind the popover.
  useEffect(() => {
    const box = list.current
    const item = box?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (box && item) box.scrollTop = item.offsetTop - (box.clientHeight - item.offsetHeight) / 2
  }, [])

  const move = (event: KeyboardEvent<HTMLButtonElement>) => {
    const sibling =
      event.key === 'ArrowDown'
        ? event.currentTarget.nextElementSibling
        : event.key === 'ArrowUp'
          ? event.currentTarget.previousElementSibling
          : undefined
    if (sibling === undefined) return
    event.preventDefault()
    if (sibling instanceof HTMLElement) sibling.focus()
  }

  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-center text-xs" aria-hidden>
        {label}
      </p>
      <div
        ref={list}
        role="listbox"
        aria-label={label}
        className="relative flex max-h-60 w-20 flex-col gap-0.5 overflow-y-auto"
      >
        {items.map((item, i) => {
          const isSelected = item === selected
          return (
            <button
              key={item}
              type="button"
              role="option"
              aria-selected={isSelected}
              tabIndex={isSelected || (selected === '' && i === 0) ? 0 : -1}
              className={cn(
                'focus-visible:ring-ring/50 h-11 shrink-0 rounded-md text-sm tabular-nums outline-none focus-visible:ring-3',
                isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
              )}
              onClick={() => onSelect(item)}
              onKeyDown={move}
            >
              {item}
            </button>
          )
        })}
      </div>
    </div>
  )
}
