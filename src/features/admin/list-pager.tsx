import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** Previous and next buttons around "page x / y", with the total number of rows. */
export function ListPager({
  page,
  pageCount,
  total,
  totalLabel,
  onPage,
}: {
  page: number
  pageCount: number
  total: number
  /** Describes the total, e.g. "42 quán". */
  totalLabel: string
  onPage: (page: number) => void
}) {
  const { t } = useTranslation('admin')
  return (
    <nav
      aria-label={t('pager.label')}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-muted-foreground text-sm tabular-nums">{total > 0 && totalLabel}</p>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="h-11 px-4"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeft aria-hidden />
          {t('pager.previous')}
        </Button>
        <span className="text-sm tabular-nums">{t('pager.page', { page, pageCount })}</span>
        <Button
          variant="outline"
          className="h-11 px-4"
          disabled={page >= pageCount}
          onClick={() => onPage(page + 1)}
        >
          {t('pager.next')}
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </nav>
  )
}
