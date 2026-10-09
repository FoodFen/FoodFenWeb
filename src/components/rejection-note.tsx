import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleX } from 'lucide-react'

export function RejectionNote({ reason }: { reason: string | null }) {
  if (!reason) return null
  return (
    <Alert variant="destructive">
      <CircleX aria-hidden />
      <AlertTitle>Lý do từ chối</AlertTitle>
      <AlertDescription>{reason}</AlertDescription>
    </Alert>
  )
}
