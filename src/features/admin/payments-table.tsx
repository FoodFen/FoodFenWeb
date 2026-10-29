import type { AdminPaymentRowResponse } from '@/api/generated'
import { EmptyState } from '@/components/empty-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime, formatVnd } from '@/lib/format'
import { Receipt } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PaymentItem } from './payment-item'
import { PaymentStatusBadge } from '@/components/payment-status-badge'

export function PaymentsTable({ payments }: { payments: AdminPaymentRowResponse[] }) {
  const { t } = useTranslation('admin')
  if (payments.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title={t('payments.empty.title')}
        hint={t('payments.empty.hint')}
      />
    )
  }

  return (
    <Table className="min-w-[64rem]">
      <TableHeader>
        <TableRow>
          <TableHead>{t('payments.columns.order')}</TableHead>
          <TableHead>{t('payments.columns.created')}</TableHead>
          <TableHead>{t('payments.columns.payer')}</TableHead>
          <TableHead>{t('payments.columns.item')}</TableHead>
          <TableHead>{t('payments.columns.provider')}</TableHead>
          <TableHead className="text-right">{t('payments.columns.amount')}</TableHead>
          <TableHead>{t('payments.columns.status')}</TableHead>
          <TableHead>{t('payments.columns.paidAt')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-mono text-xs">{payment.orderCode}</TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {formatDateTime(payment.createdAt)}
            </TableCell>
            <TableCell className="max-w-56">
              <span className="block truncate font-medium">
                {payment.userName ?? payment.userEmail}
              </span>
              {payment.userName && (
                <span className="text-muted-foreground block truncate text-xs">
                  {payment.userEmail}
                </span>
              )}
            </TableCell>
            <TableCell>
              <PaymentItem payment={payment} />
            </TableCell>
            <TableCell>{t(`payments.provider.${payment.provider}`)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatVnd(payment.amount)}</TableCell>
            <TableCell>
              <PaymentStatusBadge status={payment.status} />
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {payment.paidAt ? formatDateTime(payment.paidAt) : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
