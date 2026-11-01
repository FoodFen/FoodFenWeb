import type { AdminMascotResponse } from '@/api/generated'
import { BODY_COLOR_DEFAULT, MASCOT_STATES } from './mascot-states'
import { cn } from 'cn'
import { PawPrint } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CYCLE_MS = 1200

/** Fixed light and dark backgrounds on purpose: the admin sees both whatever the theme is. */
const PANELS = [
  { id: 'light', className: 'bg-white text-neutral-900', fallback: BODY_COLOR_DEFAULT.light },
  { id: 'dark', className: 'bg-neutral-900 text-white', fallback: BODY_COLOR_DEFAULT.dark },
] as const

/** How the app will show the mascot, on its body-color circle: cycles through the states, a state without art uses idle. */
export function MascotPreview({
  images,
  bodyColor,
}: {
  images: AdminMascotResponse['images']
  bodyColor: string | null
}) {
  const { t } = useTranslation('admin')
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % MASCOT_STATES.length), CYCLE_MS)
    return () => clearInterval(timer)
  }, [reduceMotion])

  const state = MASCOT_STATES[index]
  const url = images[state] ?? images.idle

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3">
        {PANELS.map((panel) => (
          <div
            key={panel.id}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border p-4',
              panel.className,
            )}
          >
            <span
              className="flex size-28 items-center justify-center rounded-full"
              style={{ backgroundColor: bodyColor ?? panel.fallback }}
            >
              {url ? (
                <img src={url} alt="" className="size-24 object-contain" />
              ) : (
                <span className="flex flex-col items-center justify-center gap-1 text-white">
                  <PawPrint className="size-8" aria-hidden />
                  <span className="text-sm font-medium">{t('mascots.preview.fen')}</span>
                </span>
              )}
            </span>
            <span className="text-sm">{t(`mascots.states.${state}`)}</span>
          </div>
        ))}
      </div>
      {reduceMotion && (
        <div className="flex flex-wrap gap-2">
          {MASCOT_STATES.map((name, i) => (
            <button
              key={name}
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                'h-9 rounded-full border px-3 text-sm',
                i === index && 'bg-primary text-primary-foreground',
              )}
            >
              {t(`mascots.states.${name}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
