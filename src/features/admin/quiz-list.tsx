import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { quizzes } from './mock-content'

export function QuizList() {
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
        {quizzes.map((quiz) => (
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
