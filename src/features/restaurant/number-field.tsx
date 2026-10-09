import { FormField } from '@/components/form-field'
import { Input } from '@/components/ui/input'
import type { ComponentProps } from 'react'

type Props = Omit<ComponentProps<typeof Input>, 'id'> & {
  id: string
  label: string
  error?: string
  hint?: string
}

export function NumberField({ id, label, error, hint, ...input }: Props) {
  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      <Input
        id={id}
        inputMode="decimal"
        className="h-11"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...input}
      />
    </FormField>
  )
}
