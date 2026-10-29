import { PaymentsPage } from '@/features/admin/payments-page'
import { paymentsSearchSchema } from '@/features/admin/payments-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/payments')({
  validateSearch: paymentsSearchSchema,
  component: PaymentsPage,
})
