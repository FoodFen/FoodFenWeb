import { EmptyState } from '@/components/empty-state'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function NoRestaurant() {
  const { t } = useTranslation('restaurant')
  return (
    <EmptyState icon={Store} title={t('stats.noRestaurant.message')}>
      <Link to="/restaurant" className={buttonVariants({ className: 'mt-2 h-11 px-4' })}>
        {t('stats.noRestaurant.link')}
      </Link>
    </EmptyState>
  )
}
