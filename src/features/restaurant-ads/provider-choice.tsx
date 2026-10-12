import type { PaymentProvider } from '@/api/generated'

const providers: { value: PaymentProvider; label: string }[] = [
  { value: 'payos', label: 'PayOS' },
  { value: 'momo', label: 'MoMo' },
]

type Props = { value: PaymentProvider; onChange: (value: PaymentProvider) => void }

export function ProviderChoice({ value, onChange }: Props) {
  return (
    <fieldset className="flex flex-wrap items-center gap-x-6 gap-y-1">
      <legend className="mb-1 text-sm font-medium">Thanh toán qua</legend>
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
