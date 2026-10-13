import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { big, useShift, wrap } from './shared'
import { Photo } from '@/components/photo'
import { ease } from '@/lib/motion'
import { ids } from '@/lib/photos'

function CountUp({ to }: { to: number }) {
  const reduce = useReducedMotion()
  const value = useMotionValue(reduce ? to : 0)
  const text = useTransform(value, (v) => Math.round(v))
  useEffect(() => {
    if (reduce) return
    const controls = animate(value, to, { duration: 1.6, delay: 1.1, ease: 'easeOut' })
    return () => controls.stop()
  }, [reduce, to, value])
  return <motion.span>{text}</motion.span>
}

function Chip({
  name,
  kcal,
  className,
  order,
}: {
  name: string
  kcal: number
  className: string
  order: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9 + order * 0.25, type: 'spring', stiffness: 260, damping: 20 }}
      className={`bg-background/90 absolute flex items-baseline gap-2 rounded-lg px-3 py-1.5 text-sm shadow-sm backdrop-blur ${className}`}
    >
      <span className="font-medium">{name}</span>
      <span className="text-muted-foreground tabular-nums">{kcal} kcal</span>
    </motion.div>
  )
}

export function Hero() {
  const { t } = useTranslation('landing')
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useShift(scrollYProgress, -30, 30)
  const phoY = useShift(scrollYProgress, 0, -150)
  const bowlY = useShift(scrollYProgress, 0, 90)
  const reduce = useReducedMotion()

  return (
    <section
      ref={ref}
      className={`${wrap} grid items-center gap-12 overflow-x-clip py-10 md:grid-cols-[1.05fr_0.95fr] md:py-14`}
    >
      <div className="space-y-6">
        <h1 className="text-5xl leading-[1.05] font-bold tracking-tight md:text-7xl">
          <span className="sr-only">{t('hero.title')}</span>
          <span aria-hidden className="block">
            {t('hero.title')
              .split(' ')
              .map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.09, ease }}
                  >
                    {word}&nbsp;
                  </motion.span>
                </span>
              ))}
          </span>
        </h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease }}
          className="text-muted-foreground max-w-[46ch] text-lg"
        >
          {t('hero.subtitle')}
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease }}
          className="flex flex-wrap gap-3"
        >
          <Link to="/register" className={buttonVariants({ className: big })}>
            {t('cta.tryFree')}
          </Link>
          <a
            href="#cach-hoat-dong"
            className={buttonVariants({ variant: 'outline', className: big })}
          >
            {t('hero.how')}
          </a>
        </motion.div>
      </div>

      <div className="relative h-[26rem] md:h-[34rem]">
        <div className="bg-secondary absolute inset-0 overflow-hidden rounded-2xl">
          <motion.div style={{ y: imageY, scale: 1.15 }} className="h-full w-full">
            <Photo
              id={ids.bowl}
              alt={t('hero.bowlAlt')}
              w={900}
              h={1100}
              priority
              className="h-full w-full"
            />
          </motion.div>
        </div>
        <Chip name={t('hero.chips.salmon')} kcal={180} order={0} className="top-[34%] left-[14%]" />
        <Chip name={t('hero.chips.egg')} kcal={70} order={1} className="top-[24%] right-[16%]" />
        <motion.div
          style={{ y: phoY }}
          className="border-background absolute -bottom-6 -left-3 size-32 overflow-hidden rounded-full border-4 md:-left-10 md:size-44"
        >
          <Photo id={ids.pho} alt={t('photos.pho')} w={400} className="size-full" />
        </motion.div>
        <motion.div
          style={{ y: bowlY }}
          className="border-background absolute -top-4 -right-2 size-24 overflow-hidden rounded-2xl border-4 md:-right-6 md:size-32"
        >
          <Photo id={ids.buddha} alt={t('photos.buddha')} w={300} className="size-full" />
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1, ease }}
          className="bg-background/95 absolute right-3 bottom-3 w-52 rounded-2xl p-4 shadow-sm backdrop-blur md:right-5 md:bottom-5 md:w-56"
        >
          <p className="text-muted-foreground text-sm">{t('hero.meal.name')}</p>
          <p className="text-3xl font-bold tabular-nums">
            <CountUp to={520} />{' '}
            <span className="text-muted-foreground text-base font-medium">kcal</span>
          </p>
          <p className="text-muted-foreground mt-1 text-xs tabular-nums">{t('hero.meal.macros')}</p>
        </motion.div>
      </div>
    </section>
  )
}
