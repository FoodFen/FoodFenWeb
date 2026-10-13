/** `aria-*` wiring for a control inside `FormField`: the error (else the hint) describes it. */
export function fieldProps(id: string, error?: string, hint?: string) {
  return {
    id,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  }
}
