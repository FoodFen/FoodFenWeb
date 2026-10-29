import { selectClass } from '@/components/select-class'
import { Label } from '@/components/ui/label'
import { useId } from 'react'

/** A labelled native select whose first option, with an empty value, means "no filter". */
export function FilterSelect<T extends string>({
  label,
  anyLabel,
  value,
  options,
  onChange,
}: {
  label: string
  anyLabel: string
  value: T | undefined
  options: { value: T; label: string }[]
  onChange: (value: T | undefined) => void
}) {
  const id = useId()
  return (
    <div className="w-full space-y-2 sm:w-44">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className={selectClass}
        value={value ?? ''}
        onChange={(e) => onChange((e.target.value || undefined) as T | undefined)}
      >
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
