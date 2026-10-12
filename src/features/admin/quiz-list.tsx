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
import { QueryError } from '@/components/query-error'
import { useQuizzes } from './use-content'

export function QuizList() {
  const quizzes = useQuizzes()

  if (quizzes.isPending) return <Skeleton className="h-40 w-full" aria-busy />
  if (quizzes.isError)
    return <QueryError error={quizzes.error} onRetry={() => void quizzes.refetch()} />
  if (quizzes.data.length === 0)
    return <p className="text-muted-foreground py-12 text-center">Chưa có câu hỏi nào.</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Câu hỏi</TableHead>
          <TableHead className="hidden sm:table-cell">Chủ đề</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quizzes.data.map((quiz) => (
          <TableRow key={quiz.id}>
            <TableCell className="max-w-md font-medium whitespace-normal">
              {quiz.question}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge variant="secondary">{quiz.topic}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={quiz.active ? 'outline' : 'secondary'}>
                {quiz.active ? 'Đang dùng' : 'Đã tắt'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
