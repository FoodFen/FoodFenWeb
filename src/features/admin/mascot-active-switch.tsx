import type { AdminMascotResponse } from '@/api/generated'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTranslation } from 'react-i18next'
import { activeLock } from './mascot-schema'

/** Shown or hidden in the app. When it cannot change, a tooltip says why. */
export function MascotActiveSwitch({
  mascot,
  busy,
  onToggle,
}: {
  mascot: AdminMascotResponse
  busy: boolean
  onToggle: (active: boolean) => void
}) {
  const { t } = useTranslation('admin')
  const lock = activeLock(mascot)
  const input = (
    <input
      type="checkbox"
      role="switch"
      checked={mascot.active}
      disabled={lock !== null || busy}
      aria-label={t('mascots.activeNamed', { name: mascot.name })}
      onChange={(event) => onToggle(event.target.checked)}
      className="bg-input checked:bg-primary focus-visible:ring-ring/50 before:bg-background relative h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full transition-colors outline-none before:absolute before:top-0.5 before:left-0.5 before:size-5 before:rounded-full before:transition-transform before:content-[''] checked:before:translate-x-5 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
  if (!lock) return input
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" tabIndex={0} />}>
        {input}
      </TooltipTrigger>
      <TooltipContent>{t(`mascots.locks.${lock}`)}</TooltipContent>
    </Tooltip>
  )
}
