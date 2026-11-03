import { FormError } from '@/components/form-parts'
import { NumberField } from '@/components/number-field'
import { useErrorText } from '@/i18n/use-error-text'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MACRO_SUM_ERROR, type FoodValues } from './food-schema'

/** Calories and macros per 100 g. The "adds up to more than 100 g" error is shown once, below them. */
export function FoodNutritionFields() {
  const { t } = useTranslation('admin')
  const errorText = useErrorText()
  const {
    register,
    formState: { errors },
  } = useFormContext<FoodValues>()
  const sumError = errors.fatG?.message === MACRO_SUM_ERROR
  const fatError = sumError ? undefined : errors.fatG?.message

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <NumberField
          whole
          id="kcal"
          label={t('foods.form.kcal')}
          error={errors.kcal?.message}
          {...register('kcal')}
        />
        <NumberField
          id="carbsG"
          label={t('foods.form.carbsG')}
          error={errors.carbsG?.message}
          {...register('carbsG')}
        />
        <NumberField
          id="proteinG"
          label={t('foods.form.proteinG')}
          error={errors.proteinG?.message}
          {...register('proteinG')}
        />
        <NumberField
          id="fatG"
          label={t('foods.form.fatG')}
          error={fatError}
          {...register('fatG')}
        />
        <NumberField
          id="fiberG"
          label={t('foods.form.fiberG')}
          hint={t('foods.form.fiberHint')}
          error={errors.fiberG?.message}
          {...register('fiberG')}
        />
      </div>
      <FormError message={sumError ? (errorText(MACRO_SUM_ERROR) ?? null) : null} />
    </div>
  )
}
