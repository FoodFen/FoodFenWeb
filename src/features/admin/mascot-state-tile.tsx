import type { MascotState } from '@/api/generated'
import { CircleAlert, ImagePlus, LoaderCircle, X } from 'lucide-react'
import { cn } from 'cn'
import { useState, type DragEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { IMAGE_ACCEPT } from './mascot-files'
import type { Slot } from './use-image-slots'

type Props = {
  state: MascotState
  /** The state's own image. */
  url?: string
  /** The idle image, shown dimmed when this state has none of its own. */
  idleUrl?: string
  slot?: Slot
  onFile: (file: File) => void
  onRemove: () => void
}

/** Click, keyboard or drop one image on it; the file input inside the label is the focus target. */
export function MascotStateTile({ state, url, idleUrl, slot, onFile, onRemove }: Props) {
  const { t } = useTranslation('admin')
  const [over, setOver] = useState(false)
  const label = t(`mascots.states.${state}`)
  const fallback = !url && state !== 'idle' ? idleUrl : undefined

  const drop = (event: DragEvent) => {
    setOver(false)
    const files = event.dataTransfer.files
    if (files.length !== 1) return // several files fall through to the grid's bulk assign
    event.preventDefault()
    event.stopPropagation()
    onFile(files[0])
  }

  return (
    <div className="space-y-1">
      <div
        className="relative"
        onDragOver={(event) => {
          event.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={drop}
      >
        <label
          className={cn(
            'bg-muted/40 focus-within:ring-ring/50 relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-dashed p-2 text-center focus-within:ring-3',
            over && 'border-primary bg-primary/10',
            url && 'border-solid',
          )}
        >
          <input
            type="file"
            accept={IMAGE_ACCEPT}
            className="sr-only"
            aria-label={t('mascots.tile.pick', { state: label })}
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (file) onFile(file)
            }}
          />
          {(url ?? fallback) ? (
            <img
              src={url ?? fallback}
              alt=""
              className={cn('size-full object-contain', fallback && 'opacity-40 grayscale')}
            />
          ) : (
            <ImagePlus className="text-muted-foreground size-6" aria-hidden />
          )}
          {fallback && (
            <span className="text-muted-foreground absolute bottom-1 text-xs">
              {t('mascots.tile.usesIdle')}
            </span>
          )}
          {slot?.pending && (
            <span className="bg-background/70 absolute inset-0 flex items-center justify-center">
              <LoaderCircle
                className="size-6 animate-spin"
                aria-label={t('mascots.tile.uploading')}
              />
            </span>
          )}
        </label>
        {url && !slot?.pending && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={t('mascots.tile.remove', { state: label })}
            className="bg-background/90 hover:bg-muted absolute top-1 right-1 flex size-8 items-center justify-center rounded-full border"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>
      <p className="text-center text-sm font-medium">{label}</p>
      {slot?.error && (
        <p role="alert" className="text-destructive flex items-start gap-1 text-xs">
          <CircleAlert className="mt-0.5 size-3 shrink-0" aria-hidden />
          {slot.error}
        </p>
      )}
    </div>
  )
}
