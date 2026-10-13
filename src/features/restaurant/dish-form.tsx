import { applyApiError } from '@/api/form-errors'
import { fieldProps } from '@/components/field-props'
import { FormField } from '@/components/form-field'
import { InputField } from '@/components/input-field'
import { NumberField } from '@/components/number-field'
import { FormError, SubmitButton } from '@/components/form-parts'
import { selectClass } from '@/components/select-class'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { DIET_TAGS } from '@/lib/diet-tag'
import { kcalLooksOff } from '@/lib/nutrition'
import { zodResolver } from '@hookform/resolvers/zod'
import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch, type FieldNamesMarkedBoolean } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { dishSchema, toDishBody, type DishValues } from './dish-schema'
import { ImageUpload } from './image-upload'

type Props = {
  defaultValues: DishValues
  submitLabel: string
  /** `dirty` lists the edited fields, so an update can send only those (any edit re-opens review). */
  onSubmit: (values: DishValues, dirty: FieldNamesMarkedBoolean<DishValues>) => Promise<void>
  upload: (file: File) => Promise<string>
}

const FIELDS = Object.keys(dishSchema.shape) as (keyof DishValues)[]

export function DishForm({ defaultValues, submitLabel, onSubmit, upload }: Props) {
  const { t } = useTranslation(['restaurant', 'common'])
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
  } = useForm<DishValues>({ resolver: zodResolver(dishSchema), defaultValues })
  const [formError, setFormError] = useState<string | null>(null)
  const imageUrl = useWatch({ control, name: 'imageUrl' })

  const values = useWatch({ control })
  const parsed = dishSchema.safeParse(values)
  const body = parsed.success ? toDishBody(parsed.data) : null
  const suspicious = body !== null && kcalLooksOff(body.kcal, body)

  const submit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await onSubmit(values, dirtyFields)
    } catch (error) {
      setFormError(applyApiError(error, setError, FIELDS))
    }
  })

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <FormField id="image" label={t('dish.form.image')}>
        <ImageUpload
          value={imageUrl}
          onChange={(url) => setValue('imageUrl', url, { shouldDirty: true })}
          upload={upload}
        />
      </FormField>
      <InputField
        id="name"
        label={t('dish.form.name')}
        autoComplete="off"
        enterKeyHint="next"
        error={errors.name?.message}
        {...register('name')}
      />
      <FormField
        id="description"
        label={t('dish.form.description')}
        error={errors.description?.message}
      >
        <Textarea
          rows={2}
          {...fieldProps('description', errors.description?.message)}
          {...register('description')}
        />
      </FormField>
      <FormField
        id="dietTag"
        label={t('dish.form.dietTag')}
        error={errors.dietTag?.message}
        hint={t('dish.form.dietTagHint')}
      >
        <select
          className={selectClass}
          {...fieldProps('dietTag', errors.dietTag?.message, t('dish.form.dietTagHint'))}
          {...register('dietTag')}
        >
          {DIET_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {t(`common:dietTag.${tag}`)}
            </option>
          ))}
        </select>
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          whole
          id="price"
          label={t('dish.form.price')}
          hint={t('dish.form.priceHint')}
          error={errors.price?.message}
          {...register('price')}
        />
        <NumberField
          whole
          id="servingG"
          label={t('dish.form.servingG')}
          error={errors.servingG?.message}
          {...register('servingG')}
        />
      </div>
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">{t('dish.form.nutrition')}</legend>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <NumberField
            whole
            id="kcal"
            label={t('dish.form.kcal')}
            error={errors.kcal?.message}
            {...register('kcal')}
          />
          <NumberField
            id="proteinG"
            label={t('dish.form.proteinG')}
            error={errors.proteinG?.message}
            {...register('proteinG')}
          />
          <NumberField
            id="carbsG"
            label={t('dish.form.carbsG')}
            error={errors.carbsG?.message}
            {...register('carbsG')}
          />
          <NumberField
            id="fatG"
            label={t('dish.form.fatG')}
            error={errors.fatG?.message}
            {...register('fatG')}
          />
          <NumberField
            id="fiberG"
            label={t('dish.form.fiberG')}
            enterKeyHint="done"
            error={errors.fiberG?.message}
            {...register('fiberG')}
          />
        </div>
        {suspicious && (
          <Alert>
            <TriangleAlert aria-hidden />
            <AlertDescription>{t('dish.form.kcalOff')}</AlertDescription>
          </Alert>
        )}
      </fieldset>
      <FormError message={formError} />
      <SubmitButton loading={isSubmitting} disabled={!isDirty}>
        {submitLabel}
      </SubmitButton>
    </form>
  )
}
