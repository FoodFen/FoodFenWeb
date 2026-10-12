import { parseApiError } from '@/api/errors'
import { Button } from '@/components/ui/button'

export function QueryError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <p role="alert">{parseApiError(error).message}</p>
      <Button variant="outline" className="h-11 px-4" onClick={onRetry}>
        Thử lại
      </Button>
    </div>
  )
}
