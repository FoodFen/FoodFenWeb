import { Skeleton } from '@/components/ui/skeleton'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { QueryError } from '@/components/query-error'
import { ChevronDown, History } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FoodChangeRow } from './food-change-row'
import { useFoodChanges } from './use-foods'

/** Who changed the food and what, newest first. Closed until asked for, and only then fetched. */
export function FoodHistory({ slug }: { slug: string }) {
  const { t } = useTranslation('admin')
  const [open, setOpen] = useState(false)
  const changes = useFoodChanges(slug, open)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-t pt-4">
      <CollapsibleTrigger className="focus-visible:ring-ring/50 flex h-11 w-full items-center gap-2 rounded-lg text-sm font-medium outline-none focus-visible:ring-3">
        <History className="size-4" aria-hidden />
        {t('foods.history.title')}
        <ChevronDown
          className={`ml-auto size-4 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {changes.isPending ? (
          <Skeleton className="h-24 w-full" aria-busy />
        ) : changes.isError ? (
          <QueryError error={changes.error} onRetry={() => void changes.refetch()} />
        ) : changes.data.length === 0 ? (
          <p className="text-muted-foreground py-3 text-sm">{t('foods.history.none')}</p>
        ) : (
          <ul className="divide-y">
            {changes.data.map((change) => (
              <FoodChangeRow key={change.id} change={change} />
            ))}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
