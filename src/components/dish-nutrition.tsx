import type { DishResponse } from '@/api/generated'
import { Badge } from '@/components/ui/badge'
import type { DietTag } from '@/lib/diet-tag'
import { formatNumber } from '@/lib/format'
import { Leaf } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Props = Pick<DishResponse, 'servingG' | 'kcal' | 'proteinG' | 'carbsG' | 'fatG' | 'fiberG'> & {
  dietTag?: DietTag
}

/** One line of per-serving nutrition and diet tag, shared by the owner's menu and the admin's review page. */
export function DishNutrition({ servingG, kcal, proteinG, carbsG, fatG, fiberG, dietTag }: Props) {
  const { t } = useTranslation()
  const parts = [
    t('nutrition.kcal', { value: formatNumber(kcal) }),
    t('nutrition.protein', { value: formatNumber(proteinG) }),
    t('nutrition.carbs', { value: formatNumber(carbsG) }),
    t('nutrition.fat', { value: formatNumber(fatG) }),
    ...(fiberG === null ? [] : [t('nutrition.fiber', { value: formatNumber(fiberG) })]),
  ]
  return (
    <p className="text-muted-foreground text-sm tabular-nums">
      {t('nutrition.perServing', { macros: parts.join(', '), serving: formatNumber(servingG) })}
      {dietTag && dietTag !== 'none' && (
        <Badge variant="outline" className="ml-2 align-middle">
          <Leaf aria-hidden />
          {t(`dietTag.${dietTag}`)}
        </Badge>
      )}
    </p>
  )
}
