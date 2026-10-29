import type { MyAdPaymentResponse } from '@/api/generated'
import { PaymentStatusBadge } from '@/components/payment-status-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime, formatVnd } from '@/lib/format'
import { useTranslation } from 'react-i18next'

const columns = ['created', 'order', 'package', 'provider', 'amount', 'status', 'paidAt'] as const

export function PaymentsTable({ payments }: { payments: MyAdPaymentResponse[] }) {
  const { t } = useTranslation(['restaurant', 'ads', 'admin'])
  return (
    <Table className="min-w-[44rem]">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column} className={column === 'amount' ? 'text-right' : undefined}>
              {t(`stats.payments.columns.${column}`)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.orderCode}>
            <TableCell className="text-muted-foreground tabular-nums">
              {formatDateTime(payment.createdAt)}
            </TableCell>
            <TableCell className="font-mono text-xs">{payment.orderCode}</TableCell>
            <TableCell>{t('ads:picker.days', { count: payment.adDays })}</TableCell>
            <TableCell>{t(`admin:payments.provider.${payment.provider}`)}</TableCell>
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
