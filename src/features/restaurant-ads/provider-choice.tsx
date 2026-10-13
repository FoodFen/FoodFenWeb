import type { PaymentProvider } from '@/api/generated'
import { useTranslation } from 'react-i18next'

// Provider names are brands, so they are not translated.
const providers: { value: PaymentProvider; label: string }[] = [
  { value: 'payos', label: 'PayOS' },
  { value: 'momo', label: 'MoMo' },
]

type Props = { value: PaymentProvider; onChange: (value: PaymentProvider) => void }

export function ProviderChoice({ value, onChange }: Props) {
  const { t } = useTranslation('ads')
  return (
    <fieldset className="flex flex-wrap items-center gap-x-6 gap-y-1">
      <legend className="mb-1 text-sm font-medium">{t('picker.payWith')}</legend>
      {providers.map((provider) => (
        <label key={provider.value} className="flex min-h-11 items-center gap-2">
          <input
            type="radio"
            name="provider"
            className="accent-primary size-4"
            checked={value === provider.value}
            onChange={() => onChange(provider.value)}
          />
          {provider.label}
        </label>
      ))}
    </fieldset>
  )
}
