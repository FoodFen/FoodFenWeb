import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export type TierFilter = 'all' | 'free' | 'premium'

const tiers: { value: TierFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'free', label: 'Miễn phí' },
  { value: 'premium', label: 'Premium' },
]

export function UsersToolbar({
  query,
  onQuery,
  tier,
  onTier,
}: {
  query: string
  onQuery: (value: string) => void
  tier: TierFilter
  onTier: (value: TierFilter) => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative w-full sm:max-w-xs">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Tìm theo tên hoặc email"
          aria-label="Tìm người dùng"
          className="h-11 pl-10"
        />
      </div>
      <div role="group" aria-label="Lọc theo gói" className="flex gap-1.5">
        {tiers.map(({ value, label }) => (
          <Button
            key={value}
            variant={tier === value ? 'default' : 'outline'}
            aria-pressed={tier === value}
            onClick={() => onTier(value)}
            className="h-11 px-4"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}
