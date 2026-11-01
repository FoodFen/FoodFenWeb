import type { AdminMascotResponse, MascotState } from '@/api/generated'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { FormError, SubmitButton } from '@/components/form-parts'
import { InputField } from '@/components/input-field'
import { NumberField } from '@/components/number-field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { parseWhole } from '@/lib/number-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { applyMascotError } from './mascot-errors'
import { MascotBodyColorField } from './mascot-body-color-field'
import { MascotPreview } from './mascot-preview'
import {
  emptyMascot,
  mascotSchema,
  slugify,
  toMascotValues,
  type MascotValues,
} from './mascot-schema'
import { MascotStateGrid } from './mascot-state-grid'
import { useImageSlots } from './use-image-slots'
import { useSaveMascot } from './use-mascots'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The mascot being edited; `null` creates a new one. */
  editing: AdminMascotResponse | null
}

export function MascotDialog({ open, onOpenChange, editing }: Props) {
  const { t } = useTranslation('admin')
  const save = useSaveMascot(editing)
  const [formError, setFormError] = useState<string | null>(null)
  const [repricing, setRepricing] = useState<MascotValues | null>(null)
  const [idEdited, setIdEdited] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
  } = useForm<MascotValues>({
    resolver: zodResolver(mascotSchema),
    defaultValues: editing ? toMascotValues(editing) : emptyMascot,
  })

  const setImage = (state: MascotState, url: string | null) => {
    const { [state]: _removed, ...rest } = getValues('images')
    setValue('images', url ? { ...rest, [state]: url } : rest, { shouldDirty: true })
  }
  const slots = useImageSlots(setImage)
  const [images, bodyColor] = useWatch({ control, name: ['images', 'bodyColor'] })
  const isDefault = editing?.id === 'default'

  const persist = async (values: MascotValues) => {
    setFormError(null)
    try {
      await save(values, dirtyFields)
      onOpenChange(false)
    } catch (error) {
      setFormError(applyMascotError(error, setError, (message) => slots.fail('idle', message)))
    }
  }
  // People who have not bought a free mascot lose it once it costs coins: ask first.
  const submit = handleSubmit((values) =>
    editing?.coinCost === 0 && parseWhole(values.coinCost) > 0
      ? setRepricing(values)
      : persist(values),
  )

  const nameField = register('name', {
    onChange: (event) => {
      if (!editing && !idEdited) {
        setValue('id', slugify(event.target.value), { shouldDirty: true })
      }
    },
  })

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? t('mascots.dialog.editTitle') : t('mascots.dialog.createTitle')}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? t('mascots.dialog.editDescription')
                : t('mascots.dialog.createDescription')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} noValidate className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <InputField
                id="name"
                label={t('mascots.dialog.name')}
                error={errors.name?.message}
                {...nameField}
              />
              <InputField
                id="id"
                label={t('mascots.dialog.id')}
                hint={editing ? t('mascots.dialog.idLocked') : t('mascots.dialog.idHint')}
                readOnly={!!editing}
                className="h-11 font-mono"
                error={errors.id?.message}
                {...register('id', { onChange: () => setIdEdited(true) })}
              />
              <NumberField
                whole
                id="coinCost"
                label={t('mascots.dialog.coinCost')}
                hint={isDefault ? t('mascots.dialog.coinCostDefault') : undefined}
                readOnly={isDefault}
                error={errors.coinCost?.message}
                {...register('coinCost')}
              />
            </div>
            <MascotBodyColorField control={control} />
            <MascotStateGrid
              images={images}
              slots={slots.slots}
              assign={(state, file) => void slots.assign(state, file)}
              onRemove={(state) => {
                slots.clear(state)
                setImage(state, null)
              }}
            />
            <MascotPreview images={images} bodyColor={bodyColor} />
            <FormError message={formError} />
            <SubmitButton loading={isSubmitting} disabled={!isDirty || slots.busy}>
              {t('mascots.dialog.save')}
            </SubmitButton>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={repricing !== null}
        onOpenChange={(next) => !next && setRepricing(null)}
        title={t('mascots.confirm.repriceTitle')}
        description={t('mascots.confirm.repriceBody')}
        confirmLabel={t('mascots.confirm.repriceAction')}
        busy={false}
        onConfirm={() => {
          const values = repricing
          setRepricing(null)
          if (values) void persist(values)
        }}
      />
    </>
  )
}
