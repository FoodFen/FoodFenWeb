import { FormError } from '@/components/form-parts'
import { Button } from '@/components/ui/button'
import { parseApiError } from '@/api/errors'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024

type Props = {
  value: string
  onChange: (url: string) => void
  /** Sends the file to the BE and resolves to the hosted URL. */
  upload: (file: File) => Promise<string>
}

export function ImageUpload({ value, onChange, upload }: Props) {
  const { t } = useTranslation('restaurant')
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function pick(file: File | undefined) {
    if (!file) return
    if (!TYPES.includes(file.type)) return setError(t('image.invalidType'))
    if (file.size > MAX_BYTES) return setError(t('image.tooLarge'))
    setError(null)
    setBusy(true)
    try {
      onChange(await upload(file))
    } catch (failure) {
      setError(parseApiError(failure).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt={t('image.uploadedAlt')}
            className="size-20 rounded-xl object-cover"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-xl">
            <ImagePlus className="size-6" aria-hidden />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 px-4"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            {busy ? <Loader2 className="animate-spin" aria-hidden /> : <ImagePlus aria-hidden />}
            {value ? t('image.change') : t('image.choose')}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              className="h-11 px-4"
              disabled={busy}
              onClick={() => onChange('')}
            >
              <X aria-hidden />
              {t('image.remove')}
            </Button>
          )}
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept={TYPES.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-label={t('image.fileLabel')}
        onChange={(event) => {
          void pick(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      <FormError message={error} />
    </div>
  )
}
