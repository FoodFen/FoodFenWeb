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
import { ListChecks } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { QueryError } from '@/components/query-error'
import { useQuizzes } from './use-content'

export function QuizList() {
  const { t } = useTranslation('admin')
  const quizzes = useQuizzes()

  if (quizzes.isPending) return <Skeleton className="h-40 w-full" aria-busy />
  if (quizzes.isError)
    return <QueryError error={quizzes.error} onRetry={() => void quizzes.refetch()} />
  if (quizzes.data.length === 0)
    return <EmptyState icon={ListChecks} title={t('content.quiz.empty')} />

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('content.quiz.question')}</TableHead>
          <TableHead className="hidden sm:table-cell">{t('content.quiz.topic')}</TableHead>
          <TableHead>{t('table.status')}</TableHead>
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
                {quiz.active ? t('content.active') : t('content.inactive')}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
