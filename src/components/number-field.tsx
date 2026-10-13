import { InputField } from '@/components/input-field'
import type { ComponentProps } from 'react'

type Props = Omit<ComponentProps<typeof InputField>, 'inputMode'> & {
  /** Whole numbers get the digits keypad, decimals the one with a separator. */
  whole?: boolean
}

export function NumberField({ whole = false, ...props }: Props) {
  return <InputField inputMode={whole ? 'numeric' : 'decimal'} enterKeyHint="next" {...props} />
}
