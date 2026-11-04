import type { AdminFoodResponse } from '@/api/generated'
import { fieldProps } from '@/components/field-props'
import { FormError, SubmitButton } from '@/components/form-parts'
import { FormField } from '@/components/form-field'
import { InputField } from '@/components/input-field'
import { selectClass } from '@/components/select-class'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info } from 'lucide-react'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FoodAliasesField } from './food-aliases-field'
import { foodCategories } from './food-categories'
import { applyFoodError } from './food-errors'
import { FoodNutritionFields } from './food-nutrition-fields'
import {
  foodSchema,
  newFoodValues,
  toFoodValues,
  type FoodPrefill,
  type FoodValues,
} from './food-schema'
import { FoodServingsField } from './food-servings-field'
import { useSaveFood } from './use-foods'

type Props = {
  /** The food being edited; `null` creates a new one. */
  food: AdminFoodResponse | null
  prefill?: FoodPrefill
  onDone: () => void
}

export function FoodForm({ food, prefill, onDone }: Props) {
  const { t } = useTranslation('admin')
  const save = useSaveFood(food)
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<FoodValues>({
    resolver: zodResolver(foodSchema),
    defaultValues: food ? toFoodValues(food) : newFoodValues(prefill),
  })
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = form

  const submit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await save(values, prefill?.missId)
      onDone()
    } catch (error) {
      setFormError(applyFoodError(error, setError, values.servings.length))
    }
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="name"
            label={t('foods.form.name')}
            autoComplete="off"
            error={errors.name?.message}
            {...register('name')}
          />
          <InputField
            id="nameEn"
            label={t('foods.form.nameEn')}
            autoComplete="off"
            error={errors.nameEn?.message}
            {...register('nameEn')}
          />
        </div>
        <Controller
          control={control}
          name="aliases"
          render={({ field, fieldState }) => (
            <FoodAliasesField
              value={field.value}
              onChange={field.onChange}
              serverError={fieldState.error?.message}
            />
          )}
        />
        <FormField id="category" label={t('foods.form.category')} error={errors.category?.message}>
          <select
            className={selectClass}
            {...fieldProps('category', errors.category?.message)}
            {...register('category')}
          >
            {foodCategories.map((value) => (
              <option key={value} value={value}>
                {t(`foods.categories.${value}`)}
              </option>
            ))}
          </select>
        </FormField>
        {food && food.sourceKind !== 'team' && (
          <Alert>
            <Info aria-hidden />
            <AlertDescription>{t('foods.form.sourceNotice')}</AlertDescription>
          </Alert>
        )}
        <FoodNutritionFields />
        <FoodServingsField />
        <FormError message={formError} />
        <SubmitButton loading={isSubmitting} disabled={!!food && !isDirty}>
          {t('foods.form.save')}
        </SubmitButton>
      </form>
    </FormProvider>
  )
}
