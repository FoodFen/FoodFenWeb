import { applyApiError } from '@/api/form-errors'
import { FormField } from '@/components/form-field'
import { FormError, SubmitButton } from '@/components/form-parts'
import { selectClass } from '@/components/select-class'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DIET_TAG_LABELS } from '@/lib/diet-tag'
import { kcalLooksOff } from '@/lib/nutrition'
import { zodResolver } from '@hookform/resolvers/zod'
import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch, type FieldNamesMarkedBoolean } from 'react-hook-form'
import { dishSchema, toDishBody, type DishValues } from './dish-schema'
import { ImageUpload } from './image-upload'
import { NumberField } from './number-field'

type Props = {
  defaultValues: DishValues
  submitLabel: string
  /** `dirty` lists the edited fields, so an update can send only those (any edit re-opens review). */
  onSubmit: (values: DishValues, dirty: FieldNamesMarkedBoolean<DishValues>) => Promise<void>
  upload: (file: File) => Promise<string>
}

const FIELDS = Object.keys(dishSchema.shape) as (keyof DishValues)[]

export function DishForm({ defaultValues, submitLabel, onSubmit, upload }: Props) {
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
      <FormField id="image" label="Ảnh món">
        <ImageUpload
          value={imageUrl}
          onChange={(url) => setValue('imageUrl', url, { shouldDirty: true })}
          upload={upload}
        />
      </FormField>
      <FormField id="name" label="Tên món" error={errors.name?.message}>
        <Input id="name" className="h-11" aria-invalid={!!errors.name} {...register('name')} />
      </FormField>
      <FormField
        id="description"
        label="Mô tả (không bắt buộc)"
        error={errors.description?.message}
      >
        <Textarea id="description" rows={2} {...register('description')} />
      </FormField>
      <FormField
        id="dietTag"
        label="Chế độ ăn"
        error={errors.dietTag?.message}
        hint="Chay: không thịt, cá (có thể có trứng, sữa). Thuần chay: không có sản phẩm từ động vật."
      >
        <select id="dietTag" className={selectClass} {...register('dietTag')}>
          {Object.entries(DIET_TAG_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          id="price"
          label="Giá (đồng)"
          error={errors.price?.message}
          {...register('price')}
        />
        <NumberField
          id="servingG"
          label="Khẩu phần (g)"
          error={errors.servingG?.message}
          {...register('servingG')}
        />
      </div>
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">Dinh dưỡng cho một khẩu phần</legend>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <NumberField
            id="kcal"
            label="Năng lượng (kcal)"
            error={errors.kcal?.message}
            {...register('kcal')}
          />
          <NumberField
            id="proteinG"
            label="Đạm (g)"
            error={errors.proteinG?.message}
            {...register('proteinG')}
          />
          <NumberField
            id="carbsG"
            label="Tinh bột (g)"
            error={errors.carbsG?.message}
            {...register('carbsG')}
          />
          <NumberField
            id="fatG"
            label="Chất béo (g)"
            error={errors.fatG?.message}
            {...register('fatG')}
          />
          <NumberField
            id="fiberG"
            label="Chất xơ (g, tuỳ chọn)"
            error={errors.fiberG?.message}
            {...register('fiberG')}
          />
        </div>
        {suspicious && (
          <Alert>
            <TriangleAlert aria-hidden />
            <AlertDescription>
              Năng lượng lệch nhiều so với đạm, tinh bột và chất béo (4 kcal/g đạm và tinh bột, 9
              kcal/g chất béo). Kiểm tra lại số liệu trước khi gửi duyệt.
            </AlertDescription>
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
