import { Skeleton } from '@/components/ui/skeleton'

export function PageSkeleton() {
  return (
    <div className="space-y-4" aria-busy>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  )
}
