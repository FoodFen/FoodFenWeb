import {
  listQuestsAdminQuestsGetOptions,
  listQuizzesAdminQuizzesGetOptions,
} from '@/api/generated/@tanstack/react-query.gen'
import { useQuery } from '@tanstack/react-query'

export const useQuizzes = () => useQuery(listQuizzesAdminQuizzesGetOptions())

export const useQuests = () => useQuery(listQuestsAdminQuestsGetOptions())
