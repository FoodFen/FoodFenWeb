import { parseApiError } from '@/api/errors'
import type { OwnerAdPackageResponse, PaymentProvider } from '@/api/generated'
import { FormError } from '@/components/form-parts'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatVnd } from '@/lib/format'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderChoice } from './provider-choice'
import { useAdCheckout } from './use-ads'

type Props = { packages: OwnerAdPackageResponse[]; approved: boolean }

export function PackagePicker({ packages, approved }: Props) {
  const { t } = useTranslation('ads')
  const checkout = useAdCheckout()
  const [provider, setProvider] = useState<PaymentProvider>('payos')
  const [buying, setBuying] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function buy(packageId: string) {
    setError(null)
    setBuying(packageId)
    try {
      await checkout(packageId, provider)
    } catch (failure) {
      setError(parseApiError(failure).message)
      setBuying(null)
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{t('picker.title')}</h2>
      {!approved && <p className="text-muted-foreground text-sm">{t('picker.notApproved')}</p>}
      {packages.length === 0 ? (
        <p className="text-muted-foreground">{t('picker.none')}</p>
      ) : (
        <>
          <ProviderChoice value={provider} onChange={setProvider} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((item) => (
              <Card key={item.id} className="rounded-2xl">
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold tabular-nums">
                      {t('picker.days', { count: item.days })}
                    </p>
                    <p className="text-muted-foreground tabular-nums">{formatVnd(item.priceVnd)}</p>
                  </div>
                  <Button
                    className="h-11 w-full"
                    disabled={!approved || buying !== null}
                    onClick={() => void buy(item.id)}
                  >
                    {buying === item.id && <LoaderCircle className="animate-spin" aria-hidden />}
                    {t('picker.buy')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
      <FormError message={error} />
    </section>
  )
}
