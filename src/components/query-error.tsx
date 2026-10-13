import { parseApiError } from '@/api/errors'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export function QueryError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <p role="alert">{parseApiError(error).message}</p>
      <Button variant="outline" className="h-11 px-4" onClick={onRetry}>
        {t('retry')}
      </Button>
    </div>
  )
}
