import { applyApiError } from '@/api/form-errors'
import { FormField } from '@/components/form-field'
import { FormError, SubmitButton } from '@/components/form-parts'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { ImageUpload } from './image-upload'
import { restaurantSchema, type RestaurantValues } from './restaurant-schema'

type Props = {
  defaultValues: RestaurantValues
  submitLabel: string
  onSubmit: (values: RestaurantValues) => Promise<void>
  upload: (file: File) => Promise<string>
}

const FIELDS = ['name', 'description', 'address', 'phone', 'openingHours', 'imageUrl'] as const

export function RestaurantForm({ defaultValues, submitLabel, onSubmit, upload }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RestaurantValues>({ resolver: zodResolver(restaurantSchema), defaultValues })
  const [formError, setFormError] = useState<string | null>(null)
  const imageUrl = useWatch({ control, name: 'imageUrl' })

  const submit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await onSubmit(values)
    } catch (error) {
      setFormError(applyApiError(error, setError, FIELDS))
    }
  })

  return (
    <form onSubmit={submit} noValidate className="max-w-2xl space-y-5">
      <FormField id="image" label="Ảnh quán">
        <ImageUpload
          value={imageUrl}
          onChange={(url) => setValue('imageUrl', url, { shouldDirty: true })}
          upload={upload}
        />
      </FormField>
      <FormField id="name" label="Tên quán" error={errors.name?.message}>
        <Input id="name" className="h-11" aria-invalid={!!errors.name} {...register('name')} />
      </FormField>
      <FormField
        id="description"
        label="Mô tả (không bắt buộc)"
        error={errors.description?.message}
      >
        <Textarea id="description" rows={3} {...register('description')} />
      </FormField>
      <FormField id="address" label="Địa chỉ" error={errors.address?.message}>
        <Input
          id="address"
          className="h-11"
          autoComplete="street-address"
          aria-invalid={!!errors.address}
          {...register('address')}
        />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="phone" label="Số điện thoại" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            className="h-11"
            aria-invalid={!!errors.phone}
            {...register('phone')}
          />
        </FormField>
        <FormField
          id="openingHours"
          label="Giờ mở cửa"
          hint="Ví dụ: 7:00 - 21:00 hằng ngày"
          error={errors.openingHours?.message}
        >
          <Input
            id="openingHours"
            className="h-11"
            aria-invalid={!!errors.openingHours}
            {...register('openingHours')}
          />
        </FormField>
      </div>
      <FormField
        id="location"
        label="Toạ độ trên Google Maps"
        hint="Mở Google Maps, nhấn chuột phải vào vị trí quán, chọn dòng toạ độ để sao chép rồi dán vào đây."
        error={errors.location?.message}
      >
        <Input
          id="location"
          className="h-11"
          inputMode="decimal"
          placeholder="10.7769, 106.7009"
          aria-invalid={!!errors.location}
          {...register('location')}
        />
      </FormField>
      <FormError message={formError} />
      <SubmitButton loading={isSubmitting} disabled={!isDirty}>
        {submitLabel}
      </SubmitButton>
    </form>
  )
}
