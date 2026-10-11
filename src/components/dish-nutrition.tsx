import type { DishResponse } from '@/api/generated'
import { Badge } from '@/components/ui/badge'
import { DIET_TAG_LABELS, type DietTag } from '@/lib/diet-tag'
import { formatNumber } from '@/lib/format'
import { Leaf } from 'lucide-react'

type Props = Pick<DishResponse, 'servingG' | 'kcal' | 'proteinG' | 'carbsG' | 'fatG' | 'fiberG'> & {
  dietTag?: DietTag
}

/** One line of per-serving nutrition and diet tag, shared by the owner's menu and the admin's review page. */
export function DishNutrition({ servingG, kcal, proteinG, carbsG, fatG, fiberG, dietTag }: Props) {
  const parts = [
    `${formatNumber(kcal)} kcal`,
    `Đạm ${formatNumber(proteinG)} g`,
    `Tinh bột ${formatNumber(carbsG)} g`,
    `Béo ${formatNumber(fatG)} g`,
    ...(fiberG === null ? [] : [`Xơ ${formatNumber(fiberG)} g`]),
  ]
  return (
    <p className="text-muted-foreground text-sm tabular-nums">
      {parts.join(', ')} cho {formatNumber(servingG)} g
      {dietTag && dietTag !== 'none' && (
        <Badge variant="outline" className="ml-2 align-middle">
          <Leaf aria-hidden />
          {DIET_TAG_LABELS[dietTag]}
        </Badge>
      )}
    </p>
  )
}
