import { applyApiError } from '@/api/form-errors'
import { fieldProps } from '@/components/field-props'
import { FormError } from '@/components/form-parts'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { rejectSchema, type RejectValues } from './reject-schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** What is being rejected, e.g. the dish name; used in the dialog title. */
  subject: string
  onReject: (reason: string) => Promise<void>
}

/** Rejecting (also used to take an approved item down) needs a reason; approving needs no dialog. */
export function RejectDialog({ open, onOpenChange, subject, onReject }: Props) {
  const { t } = useTranslation(['admin', 'common'])
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RejectValues>({ resolver: zodResolver(rejectSchema), defaultValues: { reason: '' } })

  const submit = handleSubmit(async ({ reason }) => {
    setFormError(null)
    try {
      await onReject(reason)
      reset()
      onOpenChange(false)
    } catch (error) {
      setFormError(applyApiError(error, setError, ['reason'], { 409: t('review.conflict') }))
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={submit} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle>{t('rejectDialog.title', { subject })}</DialogTitle>
            <DialogDescription>{t('rejectDialog.description')}</DialogDescription>
          </DialogHeader>
          <FormField id="reason" label={t('rejectDialog.reason')} error={errors.reason?.message}>
            <Textarea
              rows={3}
              maxLength={1000}
              {...fieldProps('reason', errors.reason?.message)}
              {...register('reason')}
            />
          </FormField>
          <FormError message={formError} />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-11 px-4"
              onClick={() => onOpenChange(false)}
            >
              {t('common:cancel')}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="h-11 px-4"
              disabled={isSubmitting}
            >
              {isSubmitting && <LoaderCircle className="animate-spin" aria-hidden />}
              {t('rejectDialog.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
