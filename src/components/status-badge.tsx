import { Badge } from '@/components/ui/badge'
import { CircleCheck, CircleX, Clock, type LucideIcon } from 'lucide-react'

type Status = 'pending' | 'approved' | 'rejected'

const statuses: Record<
  Status,
  { label: string; icon: LucideIcon; variant: 'secondary' | 'default' | 'destructive' }
> = {
  pending: { label: 'Chờ duyệt', icon: Clock, variant: 'secondary' },
  approved: { label: 'Đã duyệt', icon: CircleCheck, variant: 'default' },
  rejected: { label: 'Bị từ chối', icon: CircleX, variant: 'destructive' },
}

export function StatusBadge({ status }: { status: Status }) {
  const { label, icon: Icon, variant } = statuses[status]
  return (
    <Badge variant={variant}>
      <Icon aria-hidden />
      {label}
    </Badge>
  )
}
