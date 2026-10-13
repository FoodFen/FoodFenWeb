import { Button } from '@/components/ui/button'
import { LoaderCircle, LocateFixed } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = { onLocate: (position: { lat: number; lng: number }) => void }

/** Sets the pin to where the browser says the owner is; says why when it cannot. */
export function LocateButton({ onLocate }: Props) {
  const { t } = useTranslation('restaurant')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<'denied' | 'unavailable' | null>(null)

  function locate() {
    if (!navigator.geolocation) return setError('unavailable')
    setBusy(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setBusy(false)
        onLocate({ lat: coords.latitude, lng: coords.longitude })
      },
      (failure) => {
        setBusy(false)
        setError(failure.code === failure.PERMISSION_DENIED ? 'denied' : 'unavailable')
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    )
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="h-11 px-4"
        disabled={busy}
        onClick={locate}
      >
        {busy ? <LoaderCircle className="animate-spin" aria-hidden /> : <LocateFixed aria-hidden />}
        {t('location.locate')}
      </Button>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {t(`location.${error}`)}
        </p>
      )}
    </div>
  )
}
