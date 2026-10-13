import { FormError } from '@/components/form-parts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePaymentOrder } from './use-ads'

/** Shows the order the owner just paid for: waiting, or how it ended. Renders nothing without one. */
export function OrderBanner() {
  const { t } = useTranslation('ads')
  const { status, cancel, cancelling, cancelError, dismiss } = usePaymentOrder()

  if (!status) return null

  if (status === 'pending') {
    return (
      <Alert>
        <LoaderCircle className="animate-spin" aria-hidden />
        <AlertTitle>{t('order.pendingTitle')}</AlertTitle>
        <AlertDescription>
          <p>{t('order.pendingBody')}</p>
          <FormError message={cancelError} />
          <Button
            variant="outline"
            className="mt-3 h-11 px-4"
            disabled={cancelling}
            onClick={cancel}
          >
            {t('order.cancel')}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const paid = status === 'paid'
  const Icon = paid ? CircleCheck : CircleX
  return (
    <Alert variant={paid ? 'default' : 'destructive'}>
      <Icon aria-hidden />
      <AlertTitle>{paid ? t('order.paidTitle') : t('order.failedTitle')}</AlertTitle>
      <AlertDescription>
        <p>{paid ? t('order.paidBody') : t('order.failedBody')}</p>
        <Button variant="outline" className="mt-3 h-11 px-4" onClick={dismiss}>
          {t('order.close')}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
