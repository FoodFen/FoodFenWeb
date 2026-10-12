import { FormError } from '@/components/form-parts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react'
import { usePaymentOrder } from './use-ads'

/** Shows the order the owner just paid for: waiting, or how it ended. Renders nothing without one. */
export function OrderBanner() {
  const { status, cancel, cancelling, cancelError, dismiss } = usePaymentOrder()

  if (!status) return null

  if (status === 'pending') {
    return (
      <Alert>
        <LoaderCircle className="animate-spin" aria-hidden />
        <AlertTitle>Đang chờ xác nhận thanh toán</AlertTitle>
        <AlertDescription>
          <p>Trang sẽ tự cập nhật khi thanh toán xong.</p>
          <FormError message={cancelError} />
          <Button
            variant="outline"
            className="mt-3 h-11 px-4"
            disabled={cancelling}
            onClick={cancel}
          >
            Huỷ đơn
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
      <AlertTitle>{paid ? 'Thanh toán thành công' : 'Thanh toán chưa thành công'}</AlertTitle>
      <AlertDescription>
        <p>
          {paid
            ? 'Quán của bạn đã được gia hạn thời gian quảng cáo.'
            : 'Đơn chưa được thanh toán. Bạn có thể chọn gói và thử lại.'}
        </p>
        <Button variant="outline" className="mt-3 h-11 px-4" onClick={dismiss}>
          Đóng
        </Button>
      </AlertDescription>
    </Alert>
  )
}
