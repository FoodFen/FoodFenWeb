import type { AdminMascotResponse, MascotState } from '@/api/generated'
import { MASCOT_STATES } from './mascot-states'
import { selectClass } from '@/components/select-class'
import { ImagePlus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IMAGE_ACCEPT, stateFromFilename } from './mascot-files'
import { MascotStateTile } from './mascot-state-tile'
import type { Slot } from './use-image-slots'

type Props = {
  images: AdminMascotResponse['images']
  slots: Partial<Record<MascotState, Slot>>
  assign: (state: MascotState, file: File) => void
  onRemove: (state: MascotState) => void
}

/** The nine tiles. Several files dropped anywhere on the grid are matched to states by filename. */
export function MascotStateGrid({ images, slots, assign, onRemove }: Props) {
  const { t } = useTranslation('admin')
  const [unmatched, setUnmatched] = useState<File[]>([])

  const bulk = (files: File[]) => {
    const rest: File[] = []
    for (const file of files) {
      const state = stateFromFilename(file.name)
      if (state) assign(state, file)
      else rest.push(file)
    }
    setUnmatched((current) => [...current, ...rest])
  }

  return (
    <div
      className="space-y-3"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        bulk(Array.from(event.dataTransfer.files))
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">{t('mascots.grid.hint')}</p>
        <label className="hover:bg-muted focus-within:ring-ring/50 inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-4 text-sm font-medium focus-within:ring-3">
          <ImagePlus className="size-4" aria-hidden />
          {t('mascots.grid.bulk')}
          <input
            type="file"
            multiple
            accept={IMAGE_ACCEPT}
            className="sr-only"
            onChange={(event) => {
              bulk(Array.from(event.target.files ?? []))
              event.target.value = ''
            }}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MASCOT_STATES.map((state) => (
          <MascotStateTile
            key={state}
            state={state}
            url={images[state]}
            idleUrl={images.idle}
            slot={slots[state]}
            onFile={(file) => assign(state, file)}
            onRemove={() => onRemove(state)}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">{t('mascots.grid.formatHint')}</p>
      {unmatched.length > 0 && (
        <div role="status" className="bg-muted/50 space-y-2 rounded-xl p-3">
          <p className="text-sm">{t('mascots.grid.unmatched')}</p>
          <ul className="space-y-2">
            {unmatched.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                <select
                  className={`${selectClass} max-w-48`}
                  value=""
                  aria-label={t('mascots.grid.assign', { name: file.name })}
                  onChange={(event) => {
                    assign(event.target.value as MascotState, file)
                    setUnmatched((current) => current.filter((_, i) => i !== index))
                  }}
                >
                  <option value="" disabled>
                    {t('mascots.grid.pickState')}
                  </option>
                  {MASCOT_STATES.map((state) => (
                    <option key={state} value={state}>
                      {t(`mascots.states.${state}`)}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
