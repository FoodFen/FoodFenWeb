import { EmptyState } from '@/components/empty-state'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Coins, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { QueryError } from '@/components/query-error'
import { useQuests } from './use-content'

export function QuestList() {
  const { t } = useTranslation('admin')
  const quests = useQuests()

  if (quests.isPending) return <Skeleton className="h-40 w-full" aria-busy />
  if (quests.isError)
    return <QueryError error={quests.error} onRetry={() => void quests.refetch()} />
  if (quests.data.length === 0) return <EmptyState icon={Target} title={t('content.quest.empty')} />

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('content.quest.quest')}</TableHead>
          <TableHead className="hidden sm:table-cell">{t('content.quest.cadence')}</TableHead>
          <TableHead className="hidden sm:table-cell">{t('content.quest.target')}</TableHead>
          <TableHead>{t('content.quest.reward')}</TableHead>
          <TableHead>{t('table.status')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quests.data.map((quest) => (
          <TableRow key={quest.id}>
            <TableCell className="max-w-md font-medium whitespace-normal">{quest.title}</TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge variant="secondary">{t(`content.cadence.${quest.cadence}`)}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground hidden tabular-nums sm:table-cell">
              {quest.target}
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-1.5 tabular-nums">
                <Coins className="text-muted-foreground size-4" aria-hidden />
                {t('content.coins', { count: quest.rewardCoins })}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={quest.active ? 'outline' : 'secondary'}>
                {quest.active ? t('content.active') : t('content.inactive')}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
