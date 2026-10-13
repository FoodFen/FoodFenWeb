import { InputField } from '@/components/input-field'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCoordinates, parseCoordinates } from '@/lib/coordinates'
import { env } from '@/lib/env'
import { lazy, Suspense } from 'react'
import { useController, type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { LatLng } from './location-picker'
import type { RestaurantValues } from './restaurant-schema'

const LocationPicker = lazy(() => import('./location-picker'))

type Props = { control: Control<RestaurantValues>; onAddress: (address: string) => void }

/**
 * The coordinates text is always there (paste "10.7769, 106.7009", or set a pin without a mouse).
 * With a Maps key the picker joins it; without one, or if Maps fails to load, only the text shows.
 */
export function LocationField({ control, onAddress }: Props) {
  const { t } = useTranslation('restaurant')
  const { field, fieldState } = useController({ control, name: 'location' })
  const point = parseCoordinates(field.value)
  const position: LatLng | null = point && { lat: point.latitude, lng: point.longitude }

  return (
    <div className="space-y-3">
      {env.googleMapsKey && (
        <Suspense fallback={<Skeleton className="h-72 rounded-2xl sm:h-96" />}>
          <LocationPicker
            position={position}
            onMove={({ lat, lng }) =>
              field.onChange(formatCoordinates({ latitude: lat, longitude: lng }))
            }
            onAddress={onAddress}
          />
        </Suspense>
      )}
      <InputField
        id="location"
        label={t('form.location')}
        hint={t('form.locationHint')}
        inputMode="decimal"
        placeholder={t('form.locationPlaceholder')}
        error={fieldState.error?.message}
        {...field}
      />
    </div>
  )
}
