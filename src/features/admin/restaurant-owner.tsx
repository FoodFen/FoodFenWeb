import { useTranslation } from 'react-i18next'

export function RestaurantOwner({
  ownerName,
  ownerEmail,
}: {
  ownerName: string | null
  ownerEmail: string
}) {
  const { t } = useTranslation('admin')
  return (
    <p className="text-muted-foreground text-sm">
      {t('review.owner')}: {ownerName ? `${ownerName}, ` : ''}
      <a href={`mailto:${ownerEmail}`} className="underline-offset-4 hover:underline">
        {ownerEmail}
      </a>
    </p>
  )
}
