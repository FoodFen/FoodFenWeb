import { cn } from 'cn'
import type { ComponentProps } from 'react'

/** A native checkbox drawn as a switch; give it an `aria-label` or wrap it in a `<label>`. */
export function SwitchInput({
  className,
  ...props
}: Omit<ComponentProps<'input'>, 'type' | 'role'>) {
  return (
    <input
      type="checkbox"
      role="switch"
      className={cn(
        "bg-input checked:bg-primary focus-visible:ring-ring/50 before:bg-background relative h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full transition-colors outline-none before:absolute before:top-0.5 before:left-0.5 before:size-5 before:rounded-full before:transition-transform before:content-[''] checked:before:translate-x-5 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
