import type { AdminMascotResponse } from '@/api/generated'
import { SwitchInput } from '@/components/switch-input'
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
    <SwitchInput
      checked={mascot.active}
      disabled={lock !== null || busy}
      aria-label={t('mascots.activeNamed', { name: mascot.name })}
      onChange={(event) => onToggle(event.target.checked)}
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
