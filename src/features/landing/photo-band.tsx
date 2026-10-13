import { motion, useScroll } from 'motion/react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useShift, wrap } from './shared'
import { Photo } from '@/components/photo'
import { ids } from '@/lib/photos'

const rowA = [
  'flatlay',
  'steak',
  'pomegranate',
  'table',
  'market',
  'berries',
  'salad',
  'ramen',
] as const
const rowB = [
  'pasta',
  'pancake',
  'tacos',
  'greenBowl',
  'plate',
  'breakfast',
  'pho',
  'buddha',
] as const

type PhotoName = (typeof rowA)[number] | (typeof rowB)[number]

function Row({ items, x }: { items: readonly PhotoName[]; x: ReturnType<typeof useShift> }) {
  const { t } = useTranslation('landing')
  return (
    <motion.div style={{ x }} className="flex w-max gap-4 pl-4">
      {items.map((name) => (
        <Photo
          key={name}
          id={ids[name]}
          alt={t(`photos.${name}`)}
          w={480}
          h={340}
          className="h-44 w-64 rounded-2xl md:h-60 md:w-80"
        />
      ))}
    </motion.div>
  )
}

export function PhotoBand() {
  const { t } = useTranslation('landing')
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const xA = useShift(scrollYProgress, 0, -420)
  const xB = useShift(scrollYProgress, -420, 0)

  return (
    <section ref={ref} className="space-y-8 overflow-hidden py-12 md:py-20">
      <div className={wrap}>
        <h2 className="max-w-[24ch] text-3xl font-bold tracking-tight text-balance md:text-4xl">
          {t('band.title')}
        </h2>
      </div>
      <div className="space-y-4">
        <Row items={rowA} x={xA} />
        <Row items={rowB} x={xB} />
      </div>
    </section>
  )
}
