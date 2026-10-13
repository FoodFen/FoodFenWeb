import { Photo } from '@/components/photo'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { Link } from '@tanstack/react-router'
import { Camera, Flame, Target } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ease } from '@/lib/motion'

const benefits = [
  { icon: Camera, key: 'recognize' },
  { icon: Target, key: 'goals' },
  { icon: Flame, key: 'streaks' },
] as const

type Props = {
  title: string
  hint: string
  headline: string
  photo: { id: string; alt: string }
  children: ReactNode
}

export function AuthLayout({ title, hint, headline, photo, children }: Props) {
  const { t } = useTranslation('auth')
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  })

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-2">
      <div className="flex min-h-dvh flex-col px-4 py-6 md:px-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-primary text-xl font-semibold">
            FoodFen
          </Link>
          <div className="flex items-center">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        <motion.div
          {...rise(0)}
          className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 py-10"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{hint}</p>
          </div>
          {children}
        </motion.div>
      </div>

      <aside className="relative hidden overflow-hidden text-white lg:block">
        <motion.div
          initial={reduce ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease }}
          className="absolute inset-0"
        >
          <Photo id={photo.id} alt={photo.alt} w={1100} h={1400} priority className="size-full" />
        </motion.div>
        <div className="from-scrim/95 via-scrim/55 to-scrim/15 absolute inset-0 bg-gradient-to-t" />
        <div className="relative flex h-full flex-col justify-end gap-8 p-12">
          <motion.h2
            {...rise(0.2)}
            className="max-w-[16ch] text-5xl leading-[1.05] font-bold tracking-tight text-balance"
          >
            {headline}
          </motion.h2>
          <ul className="space-y-3">
            {benefits.map(({ icon: Icon, key }, i) => (
              <motion.li key={key} {...rise(0.35 + i * 0.1)} className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                  <Icon className="size-4" aria-hidden />
                </span>
                {t(`benefits.${key}`)}
              </motion.li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
