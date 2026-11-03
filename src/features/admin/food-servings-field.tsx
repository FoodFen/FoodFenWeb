import { FormError } from '@/components/form-parts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useErrorText } from '@/i18n/use-error-text'
import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FoodValues } from './food-schema'

const MAX = 10

/** 1 to 10 portions of the food (label and grams), one of them the default. */
export function FoodServingsField() {
  const { t } = useTranslation('admin')
  const errorText = useErrorText()
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<FoodValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'servings' })
  const rows = useWatch({ control, name: 'servings' })

  const makeDefault = (index: number) =>
    rows.forEach((_, i) => setValue(`servings.${i}.default`, i === index, { shouldDirty: true }))
  const removeRow = (index: number) => {
    const wasDefault = rows[index].default
    remove(index)
    if (wasDefault) setValue('servings.0.default', true, { shouldDirty: true })
  }

  const rowErrors = fields.flatMap((_, i) => [
    errors.servings?.[i]?.label?.message,
    errors.servings?.[i]?.grams?.message,
  ])
  const error = [errors.servings?.root?.message, errors.servings?.message, ...rowErrors].find(
    Boolean,
  )

  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-medium">{t('foods.form.servings')}</legend>
      <div role="radiogroup" aria-label={t('foods.form.servingDefault')} className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              className="h-11 min-w-0 flex-1"
              aria-label={t('foods.form.servingLabelNamed', { n: index + 1 })}
              aria-invalid={!!errors.servings?.[index]?.label}
              {...register(`servings.${index}.label`)}
            />
            <Input
              className="h-11 w-24"
              inputMode="decimal"
              aria-label={t('foods.form.servingGramsNamed', { n: index + 1 })}
              aria-invalid={!!errors.servings?.[index]?.grams}
              {...register(`servings.${index}.grams`)}
            />
            <span className="text-muted-foreground text-sm">g</span>
            <input
              type="radio"
              name="servingDefault"
              className="accent-primary size-5 shrink-0"
              aria-label={t('foods.form.servingDefaultNamed', { n: index + 1 })}
              checked={rows[index]?.default ?? false}
              onChange={() => makeDefault(index)}
            />
            <Button
              type="button"
              variant="ghost"
              className="size-11 shrink-0"
              disabled={fields.length <= 1}
              aria-label={t('foods.form.removeServing', { n: index + 1 })}
              onClick={() => removeRow(index)}
            >
              <Trash2 aria-hidden />
            </Button>
          </div>
        ))}
      </div>
      <FormError message={error ? (errorText(error) ?? null) : null} />
      <Button
        type="button"
        variant="outline"
        className="h-11 px-4"
        disabled={fields.length >= MAX}
        onClick={() => append({ label: '', grams: '', default: false })}
      >
        <Plus aria-hidden />
        {t('foods.form.addServing')}
      </Button>
    </fieldset>
  )
}
