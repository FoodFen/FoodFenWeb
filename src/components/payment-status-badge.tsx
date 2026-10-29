import type { PaymentStatus } from '@/api/generated'
import { Badge } from '@/components/ui/badge'
import { Ban, CircleCheck, CircleX, Clock, TimerOff, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const statuses: Record<
  PaymentStatus,
  { icon: LucideIcon; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  paid: { icon: CircleCheck, variant: 'default' },
  pending: { icon: Clock, variant: 'secondary' },
  cancelled: { icon: Ban, variant: 'outline' },
  expired: { icon: TimerOff, variant: 'outline' },
  failed: { icon: CircleX, variant: 'destructive' },
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { t } = useTranslation('admin')
  const { icon: Icon, variant } = statuses[status]
  return (
    <Badge variant={variant}>
      <Icon aria-hidden />
      {t(`payments.status.${status}`)}
    </Badge>
  )
}
