import { buttonVariants } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function FeaturedStatus({
  featuredUntil,
  approved,
}: {
  featuredUntil: string | null
  approved: boolean
}) {
  const { t } = useTranslation('restaurant')
  const [now] = useState(Date.now)
  if (featuredUntil !== null && new Date(featuredUntil).getTime() > now) {
    const date = formatDate(featuredUntil)
    return (
      <p className="text-sm font-medium">
        {t(approved ? 'stats.featured.running' : 'stats.featured.paused', { date })}
      </p>
    )
  }
  return (
    <>
      <p className="text-sm font-medium">{t('stats.featured.idle')}</p>
      <Link
        to="/restaurant/ads"
        className={buttonVariants({ variant: 'link', className: 'h-auto justify-start p-0' })}
      >
        {t('stats.featured.buy')}
      </Link>
    </>
  )
}
