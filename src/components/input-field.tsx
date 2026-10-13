import { fieldProps } from '@/components/field-props'
import { FormField } from '@/components/form-field'
import { Input } from '@/components/ui/input'
import type { ComponentProps } from 'react'

type Props = Omit<ComponentProps<typeof Input>, 'id'> & {
  id: string
  label: string
  error?: string
  hint?: string
}

/** Label, 44px input, hint and error in one; spread react-hook-form's `register` onto it. */
export function InputField({ id, label, error, hint, ...input }: Props) {
  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      <Input className="h-11" {...fieldProps(id, error, hint)} {...input} />
    </FormField>
  )
}
