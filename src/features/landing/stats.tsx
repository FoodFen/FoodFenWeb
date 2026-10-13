import { IconBadge } from '@/components/icon-badge'
import { ScanLine, Star, UtensilsCrossed, Users } from 'lucide-react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { formatNumber } from '@/lib/format'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Reveal } from './parts'
import { wrap } from './shared'

// Mock figures: invented for the landing page, replace with real metrics before launch.
const stats = [
  { key: 'users', icon: Users, to: 36240 },
  { key: 'meals', icon: UtensilsCrossed, to: 482610 },
  { key: 'dishes', icon: ScanLine, to: 1270 },
  { key: 'rating', icon: Star, to: 4.8 },
] as const

// Counts up in state (not a motion value) so the digits follow the language when it changes.
function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: setValue })
    return () => controls.stop()
  }, [inView, reduce, to])
  return <span ref={ref}>{formatNumber(Number.isInteger(to) ? Math.round(value) : value)}</span>
}

export function Stats() {
  const { t } = useTranslation('landing')
  return (
    <section className={`${wrap} py-8 md:py-12`}>
      <Reveal>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {stats.map(({ key, icon, to }) => (
            <div
              key={key}
              className="flex flex-col gap-3 md:border-l md:pl-6 md:first:border-l-0 md:first:pl-0"
            >
              <IconBadge icon={icon} className="bg-primary/10 text-primary" />
              <dt className="text-muted-foreground order-2 max-w-[22ch] text-sm">
                {t(`stats.${key}`)}
              </dt>
              <dd className="text-4xl font-bold tracking-tight tabular-nums md:text-5xl">
                <Count to={to} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}
