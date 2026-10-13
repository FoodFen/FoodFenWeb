import { applyApiError } from '@/api/form-errors'
import { FormField } from '@/components/form-field'
import { FormError, SubmitButton } from '@/components/form-parts'
import { InputField } from '@/components/input-field'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ImageUpload } from './image-upload'
import { LocationField } from './location-field'
import { OpeningHoursField } from './opening-hours-field'
import { restaurantSchema, type RestaurantValues } from './restaurant-schema'

type Props = {
  defaultValues: RestaurantValues
  submitLabel: string
  onSubmit: (values: RestaurantValues) => Promise<void>
  upload: (file: File) => Promise<string>
}

const FIELDS = ['name', 'description', 'address', 'phone', 'imageUrl'] as const

export function RestaurantForm({ defaultValues, submitLabel, onSubmit, upload }: Props) {
  const { t } = useTranslation('restaurant')
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RestaurantValues>({ resolver: zodResolver(restaurantSchema), defaultValues })
  const [formError, setFormError] = useState<string | null>(null)
  const imageUrl = useWatch({ control, name: 'imageUrl' })

  // A searched place only fills an empty address, never overwrites what the owner typed.
  const fillAddress = (address: string) => {
    if (getValues('address').trim() === '') {
      setValue('address', address, { shouldDirty: true, shouldValidate: true })
    }
  }

  const submit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await onSubmit(values)
    } catch (error) {
      setFormError(applyApiError(error, setError, FIELDS))
    }
  })

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <FormField id="image" label={t('form.image')}>
        <ImageUpload
          value={imageUrl}
          onChange={(url) => setValue('imageUrl', url, { shouldDirty: true })}
          upload={upload}
        />
      </FormField>
      <InputField
        id="name"
        label={t('form.name')}
        error={errors.name?.message}
        {...register('name')}
      />
      <FormField id="description" label={t('form.description')} error={errors.description?.message}>
        <Textarea id="description" rows={3} {...register('description')} />
      </FormField>
      <InputField
        id="address"
        label={t('form.address')}
        autoComplete="street-address"
        error={errors.address?.message}
        {...register('address')}
      />
      <InputField
        id="phone"
        label={t('form.phone')}
        hint={t('form.phoneHint')}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <OpeningHoursField control={control} legacyHours={defaultValues.legacyHours} />
      <LocationField control={control} onAddress={fillAddress} />
      <FormError message={formError} />
      <SubmitButton loading={isSubmitting} disabled={!isDirty}>
        {submitLabel}
      </SubmitButton>
    </form>
  )
}
