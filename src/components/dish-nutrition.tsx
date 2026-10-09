import { formatNumber } from '@/lib/format'
import type { DishResponse } from '@/api/generated'

type Props = Pick<DishResponse, 'servingG' | 'kcal' | 'proteinG' | 'carbsG' | 'fatG' | 'fiberG'>

/** One line of per-serving nutrition, shared by the owner's menu and the admin's review page. */
export function DishNutrition({ servingG, kcal, proteinG, carbsG, fatG, fiberG }: Props) {
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
    </p>
  )
}
