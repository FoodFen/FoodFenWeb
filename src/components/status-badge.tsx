import { Badge } from '@/components/ui/badge'
import { CircleCheck, CircleX, Clock, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Status = 'pending' | 'approved' | 'rejected'

const statuses: Record<
  Status,
  { icon: LucideIcon; variant: 'secondary' | 'default' | 'destructive' }
> = {
  pending: { icon: Clock, variant: 'secondary' },
  approved: { icon: CircleCheck, variant: 'default' },
  rejected: { icon: CircleX, variant: 'destructive' },
}

export function StatusBadge({ status }: { status: Status }) {
  const { t } = useTranslation()
  const { icon: Icon, variant } = statuses[status]
  return (
    <Badge variant={variant}>
      <Icon aria-hidden />
      {t(`status.${status}`)}
    </Badge>
  )
}
