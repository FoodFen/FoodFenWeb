import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { motion, useScroll } from 'motion/react'
import { useRef } from 'react'
import { big, useShift, wrap } from './shared'
import { Photo } from '@/components/photo'
import { ids } from '@/lib/photos'

export function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useShift(scrollYProgress, -60, 60)
  return (
    <section ref={ref} className={`${wrap} pb-16 md:pb-24`}>
      <div className="relative overflow-hidden rounded-2xl text-white">
        <motion.div style={{ y }} className="absolute inset-x-0 -top-16 -bottom-16">
          <Photo
            id={ids.flatlay}
            alt="Bàn ăn với trứng, rau củ và bơ"
            w={1400}
            h={700}
            className="size-full"
          />
        </motion.div>
        <div className="bg-scrim/85 absolute inset-0" />
        <div className="relative flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-16">
          <h2 className="max-w-[22ch] text-3xl font-bold tracking-tight text-balance md:text-5xl">
            Bắt đầu bữa ăn tiếp theo cùng FoodFen
          </h2>
          <Link
            to="/register"
            className={buttonVariants({
              className: `${big} text-scrim bg-white hover:bg-white/90`,
            })}
          >
            Dùng thử miễn phí
          </Link>
        </div>
      </div>
    </section>
  )
}
