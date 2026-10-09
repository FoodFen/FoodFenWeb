import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Coins } from 'lucide-react'
import { quests } from './mock-content'

export function QuestList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nhiệm vụ</TableHead>
          <TableHead className="hidden sm:table-cell">Mục tiêu</TableHead>
          <TableHead>Thưởng</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quests.map((quest) => (
          <TableRow key={quest.id}>
            <TableCell className="max-w-md font-medium whitespace-normal">{quest.title}</TableCell>
            <TableCell className="text-muted-foreground hidden tabular-nums sm:table-cell">
              {quest.target}
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-1.5 tabular-nums">
                <Coins className="text-muted-foreground size-4" aria-hidden />
                {quest.reward} xu
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
