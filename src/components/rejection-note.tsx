import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function RejectionNote({ reason }: { reason: string | null }) {
  const { t } = useTranslation()
  if (!reason) return null
  return (
    <Alert variant="destructive">
      <CircleX aria-hidden />
      <AlertTitle>{t('rejection.reason')}</AlertTitle>
      <AlertDescription>{reason}</AlertDescription>
    </Alert>
  )
}
