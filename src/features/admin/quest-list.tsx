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
import { Coins } from 'lucide-react'
import { QueryError } from '@/components/query-error'
import { useQuests } from './use-content'

const cadenceLabel = { daily: 'Hằng ngày', weekly: 'Hằng tuần' }

export function QuestList() {
  const quests = useQuests()

  if (quests.isPending) return <Skeleton className="h-40 w-full" aria-busy />
  if (quests.isError)
    return <QueryError error={quests.error} onRetry={() => void quests.refetch()} />
  if (quests.data.length === 0)
    return <p className="text-muted-foreground py-12 text-center">Chưa có nhiệm vụ nào.</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nhiệm vụ</TableHead>
          <TableHead className="hidden sm:table-cell">Chu kỳ</TableHead>
          <TableHead className="hidden sm:table-cell">Mục tiêu</TableHead>
          <TableHead>Thưởng</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quests.data.map((quest) => (
          <TableRow key={quest.id}>
            <TableCell className="max-w-md font-medium whitespace-normal">{quest.title}</TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge variant="secondary">{cadenceLabel[quest.cadence]}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground hidden tabular-nums sm:table-cell">
              {quest.target}
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-1.5 tabular-nums">
                <Coins className="text-muted-foreground size-4" aria-hidden />
                {quest.rewardCoins} xu
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={quest.active ? 'outline' : 'secondary'}>
                {quest.active ? 'Đang dùng' : 'Đã tắt'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
