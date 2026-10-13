import { applyApiError } from '@/api/form-errors'
import type { AdPackageResponse } from '@/api/generated'
import { FormField } from '@/components/form-field'
import { FormError, SubmitButton } from '@/components/form-parts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  adPackageSchema,
  emptyAdPackage,
  toAdPackageValues,
  type AdPackageValues,
} from './ad-package-schema'
import { useSaveAdPackage } from './use-ad-packages'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The package being edited; `null` creates a new one. */
  editing: AdPackageResponse | null
}

const FIELDS = ['days', 'priceVnd', 'active'] as const

export function AdPackageDialog({ open, onOpenChange, editing }: Props) {
  const { t } = useTranslation('admin')
  const save = useSaveAdPackage(editing)
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
  } = useForm<AdPackageValues>({
    resolver: zodResolver(adPackageSchema),
    defaultValues: editing ? toAdPackageValues(editing) : emptyAdPackage,
  })

  const submit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await save(values, dirtyFields)
      onOpenChange(false)
    } catch (error) {
      setFormError(applyApiError(error, setError, FIELDS))
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? t('adPackages.dialog.editTitle') : t('adPackages.dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>{t('adPackages.dialog.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="space-y-5">
          <FormField id="days" label={t('adPackages.dialog.days')} error={errors.days?.message}>
            <Input
              id="days"
              inputMode="numeric"
              className="h-11"
              aria-invalid={!!errors.days}
              {...register('days')}
            />
          </FormField>
          <FormField
            id="priceVnd"
            label={t('adPackages.dialog.price')}
            hint={t('adPackages.dialog.priceHint')}
            error={errors.priceVnd?.message}
          >
            <Input
              id="priceVnd"
              inputMode="numeric"
              className="h-11"
              aria-invalid={!!errors.priceVnd}
              {...register('priceVnd')}
            />
          </FormField>
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" className="accent-primary size-4" {...register('active')} />
            {t('adPackages.onSale')}
          </label>
          <FormError message={formError} />
          <SubmitButton loading={isSubmitting} disabled={!isDirty}>
            {t('adPackages.dialog.save')}
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}
