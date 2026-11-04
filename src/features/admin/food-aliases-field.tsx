import { fieldProps } from '@/components/field-props'
import { FormField } from '@/components/form-field'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { foodSchema } from './food-schema'

const MAX = 20
const aliasSchema = foodSchema.shape.aliases.element

type Props = { value: string[]; onChange: (value: string[]) => void; serverError?: string }

/** Other names people type for the food: Enter or a comma turns the text into a removable chip. */
export function FoodAliasesField({ value, onChange, serverError }: Props) {
  const { t } = useTranslation('admin')
  const [text, setText] = useState('')
  const [typedError, setError] = useState<string>()
  const error = typedError ?? serverError
  const hint = t('foods.form.aliasesHint', { max: MAX })

  const add = () => {
    if (text.trim() === '') return
    const parsed = aliasSchema.safeParse(text)
    if (!parsed.success) return setError(parsed.error.issues[0].message)
    setError(undefined)
    setText('')
    if (!value.some((alias) => alias.toLowerCase() === parsed.data.toLowerCase())) {
      onChange([...value, parsed.data])
    }
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ',') return
    event.preventDefault()
    add()
  }

  return (
    <FormField id="aliases" label={t('foods.form.aliases')} hint={hint} error={error}>
      <Input
        className="h-11"
        autoComplete="off"
        enterKeyHint="done"
        disabled={value.length >= MAX}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={onKeyDown}
        {...fieldProps('aliases', error, hint)}
      />
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((alias) => (
            <li
              key={alias}
              className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full py-0.5 pr-1 pl-3 text-sm"
            >
              {alias}
              <button
                type="button"
                aria-label={t('foods.form.removeAlias', { alias })}
                onClick={() => onChange(value.filter((item) => item !== alias))}
                className="hover:bg-foreground/10 focus-visible:ring-ring/50 inline-flex size-6 items-center justify-center rounded-full outline-none focus-visible:ring-3"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </FormField>
  )
}
