import type { AdminMascotResponse } from '@/api/generated'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatNumber } from '@/lib/format'
import { EyeOff, ImageOff, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MascotActiveSwitch } from './mascot-active-switch'

type Props = {
  mascot: AdminMascotResponse
  busy: boolean
  onEdit: () => void
  onToggle: (active: boolean) => void
  onDelete: () => void
}

export function MascotRow({ mascot, busy, onEdit, onToggle, onDelete }: Props) {
  const { t } = useTranslation('admin')
  const { id, name, coinCost, images, ownerCount, equippedCount, active } = mascot
  const unused = ownerCount === 0 && equippedCount === 0
  const iconButton = 'size-11'

  return (
    <TableRow>
      <TableCell>
        {images.idle ? (
          <img src={images.idle} alt="" className="size-10 object-contain" />
        ) : (
          <ImageOff className="text-muted-foreground size-6" aria-hidden />
        )}
      </TableCell>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell className="text-muted-foreground hidden font-mono text-xs md:table-cell">
        {id}
      </TableCell>
      <TableCell className="tabular-nums">
        {coinCost === 0 ? t('mascots.free') : t('mascots.coins', { value: formatNumber(coinCost) })}
      </TableCell>
      <TableCell className="text-muted-foreground hidden tabular-nums md:table-cell">
        {t('mascots.usage', { owners: ownerCount, equipped: equippedCount })}
      </TableCell>
      <TableCell>
        <MascotActiveSwitch mascot={mascot} busy={busy} onToggle={onToggle} />
      </TableCell>
      <TableCell>
        <div className="flex">
          <Button
            variant="ghost"
            className={iconButton}
            onClick={onEdit}
            aria-label={t('mascots.editNamed', { name })}
          >
            <Pencil aria-hidden />
          </Button>
          {id !== 'default' && unused && (
            <Button
              variant="ghost"
              className={iconButton}
              disabled={busy}
              onClick={onDelete}
              aria-label={t('mascots.deleteNamed', { name })}
            >
              <Trash2 aria-hidden />
            </Button>
          )}
          {id !== 'default' && !unused && active && (
            <Button
              variant="ghost"
              className={iconButton}
              disabled={busy}
              onClick={() => onToggle(false)}
              aria-label={t('mascots.hideNamed', { name })}
            >
              <EyeOff aria-hidden />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
