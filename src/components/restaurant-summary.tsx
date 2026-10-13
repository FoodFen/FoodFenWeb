import type { RestaurantResponse } from '@/api/generated'
import { RejectionNote } from '@/components/rejection-note'
import { StatusBadge } from '@/components/status-badge'
import { Clock, ImageOff, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

/** Profile card shared by the owner's page and the admin's review page. */
export function RestaurantSummary({
  restaurant,
  actions,
}: {
  restaurant: RestaurantResponse
  actions?: ReactNode
}) {
  const { t } = useTranslation()
  const { name, description, address, phone, openingHours, imageUrl, status, rejectionReason } =
    restaurant
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-40 w-full rounded-2xl object-cover sm:w-56" />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-40 w-full items-center justify-center rounded-2xl sm:w-56">
            <ImageOff className="size-8" aria-hidden />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold">{name}</h2>
            <StatusBadge status={status} />
          </div>
          {description && <p className="text-muted-foreground max-w-prose">{description}</p>}
          <dl className="space-y-1.5 text-sm">
            <Row
              icon={<MapPin aria-hidden />}
              label={t('restaurantInfo.address')}
              value={address}
            />
            <Row icon={<Phone aria-hidden />} label={t('restaurantInfo.phone')} value={phone} />
            <Row
              icon={<Clock aria-hidden />}
              label={t('restaurantInfo.openingHours')}
              value={openingHours}
            />
          </dl>
          {actions}
        </div>
      </div>
      {status === 'rejected' && <RejectionNote reason={rejectionReason} />}
    </section>
  )
}

function Row({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0">
      <dt className="sr-only">{label}</dt>
      {icon}
      <dd>{value}</dd>
    </div>
  )
}
