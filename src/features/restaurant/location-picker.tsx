import { env } from '@/lib/env'
import {
  AdvancedMarker,
  APILoadingStatus,
  APIProvider,
  Map,
  useApiLoadingStatus,
  useMap,
} from '@vis.gl/react-google-maps'
import { useTranslation } from 'react-i18next'
import { LocateButton } from './locate-button'
import { PlaceSearch, type PickedPlace } from './place-search'

export type LatLng = { lat: number; lng: number }

type Props = {
  position: LatLng | null
  onMove: (position: LatLng) => void
  /** Address of a searched place, so the form can fill its empty address field. */
  onAddress: (address: string) => void
}

const HO_CHI_MINH_CITY: LatLng = { lat: 10.7769, lng: 106.7009 }
const FAILED: APILoadingStatus[] = [APILoadingStatus.FAILED, APILoadingStatus.AUTH_FAILURE]

/** Loaded lazily: the Maps script only downloads on the restaurant form. */
export default function LocationPicker(props: Props) {
  const { i18n } = useTranslation()
  return (
    <APIProvider apiKey={env.googleMapsKey} language={i18n.language} region="VN">
      <Picker {...props} />
    </APIProvider>
  )
}

function Picker({ position, onMove, onAddress }: Props) {
  const { t } = useTranslation('restaurant')
  const map = useMap()
  const status = useApiLoadingStatus()

  if (FAILED.includes(status)) {
    return <p className="text-muted-foreground text-sm">{t('location.mapUnavailable')}</p>
  }

  // Search and "current location" jump the map there; clicks and drags stay where they are.
  const jump = (to: LatLng) => {
    onMove(to)
    map?.panTo(to)
    map?.setZoom(17)
  }
  const pickPlace = ({ position: to, address }: PickedPlace) => {
    jump(to)
    if (address) onAddress(address)
  }

  return (
    <div className="space-y-3">
      <PlaceSearch onPick={pickPlace} />
      <LocateButton onLocate={jump} />
      <div
        role="group"
        aria-label={t('location.mapLabel')}
        className="h-72 overflow-hidden rounded-2xl border sm:h-96"
      >
        <Map
          mapId={env.googleMapsMapId}
          defaultCenter={position ?? HO_CHI_MINH_CITY}
          defaultZoom={position ? 17 : 12}
          gestureHandling="cooperative"
          streetViewControl={false}
          mapTypeControl={false}
          onClick={(event) => event.detail.latLng && onMove(event.detail.latLng)}
        >
          {position && (
            <AdvancedMarker
              position={position}
              draggable
              title={t('location.pin')}
              onDragEnd={(event) =>
                event.latLng && onMove({ lat: event.latLng.lat(), lng: event.latLng.lng() })
              }
            />
          )}
        </Map>
      </div>
    </div>
  )
}
