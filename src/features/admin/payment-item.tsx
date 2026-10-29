import type { AdminPaymentRowResponse } from '@/api/generated'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

/** What was bought: the plan, and for an ad package its length and the restaurant it promotes. */
export function PaymentItem({ payment }: { payment: AdminPaymentRowResponse }) {
  const { t } = useTranslation('admin')
  const { planType, adDays, restaurantId, restaurantName } = payment
  if (planType !== 'ad_package') return <span>{t(`payments.plan.${planType}`)}</span>
  return (
    <span className="block">
      <span className="block">
        {adDays === null ? t('payments.plan.ad_package') : t('payments.adDays', { count: adDays })}
      </span>
      {restaurantId && (
        <Link
          to="/admin/restaurants/$restaurantId"
          params={{ restaurantId }}
          className="text-primary block max-w-48 truncate text-xs underline-offset-4 hover:underline"
        >
          {restaurantName ?? restaurantId}
        </Link>
      )}
    </span>
  )
}
