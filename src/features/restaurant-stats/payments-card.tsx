import type { MyAdPaymentResponse } from '@/api/generated'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PaymentsTable } from './payments-table'

type Props = {
  payments: MyAdPaymentResponse[]
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
}

export function PaymentsCard({ payments, hasMore, loadingMore, onLoadMore }: Props) {
  const { t } = useTranslation('restaurant')
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">{t('stats.payments.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-2">
        {payments.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={t('stats.payments.empty.title')}
            hint={t('stats.payments.empty.hint')}
          />
        ) : (
          <PaymentsTable payments={payments} />
        )}
        {hasMore && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="h-11 px-4"
              disabled={loadingMore}
              onClick={onLoadMore}
            >
              {t('stats.payments.loadMore')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
