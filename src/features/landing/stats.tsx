import { IconBadge } from '@/components/icon-badge'
import { ScanLine, Star, UtensilsCrossed, Users } from 'lucide-react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { useEffect, useRef } from 'react'
import { Reveal } from './parts'
import { wrap } from './shared'

// Mock figures: invented for the landing page, replace with real metrics before launch.
const stats = [
  { icon: Users, to: 36240, decimals: 0, label: 'người dùng đang hoạt động' },
  { icon: UtensilsCrossed, to: 482610, decimals: 0, label: 'bữa ăn đã được ghi lại' },
  { icon: ScanLine, to: 1270, decimals: 0, label: 'món ăn Việt và quốc tế nhận diện được' },
  { icon: Star, to: 4.8, decimals: 1, label: 'điểm đánh giá trên 5 sao' },
]

function Count({ to, decimals }: { to: number; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const value = useMotionValue(reduce ? to : 0)
  const text = useTransform(value, (n) =>
    n.toLocaleString('vi-VN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
  )
  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(value, to, { duration: 1.8, ease: 'easeOut' })
    return () => controls.stop()
  }, [inView, reduce, to, value])
  return <motion.span ref={ref}>{text}</motion.span>
}

export function Stats() {
  return (
    <section className={`${wrap} py-8 md:py-12`}>
      <Reveal>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {stats.map(({ icon, to, decimals, label }) => (
            <div
              key={label}
              className="flex flex-col gap-3 md:border-l md:pl-6 md:first:border-l-0 md:first:pl-0"
            >
              <IconBadge icon={icon} className="bg-primary/10 text-primary" />
              <dt className="text-muted-foreground order-2 max-w-[22ch] text-sm">{label}</dt>
              <dd className="text-4xl font-bold tracking-tight tabular-nums md:text-5xl">
                <Count to={to} decimals={decimals} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}
