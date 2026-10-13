import { Star } from 'lucide-react'
import { useScroll } from 'motion/react'
import { motion } from 'motion/react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Reveal } from './parts'
import { useDesktop, useShift, wrap } from './shared'

// Mock testimonials: invented people and quotes (in src/locales), portraits from randomuser.me.
type Id = 'minhAnh' | 'giaBao' | 'ngocLan' | 'quocHuy' | 'hoangNam' | 'khanhLinh'
type Item = { id: Id; avatar: string; featured?: boolean }

const columns: Item[][] = [
  [
    { id: 'minhAnh', avatar: 'women/44' },
    { id: 'giaBao', avatar: 'men/75' },
  ],
  [
    { id: 'ngocLan', avatar: 'women/68', featured: true },
    { id: 'quocHuy', avatar: 'men/32' },
  ],
  [
    { id: 'hoangNam', avatar: 'men/46' },
    { id: 'khanhLinh', avatar: 'women/12' },
  ],
]

function Card({ id, avatar, featured }: Item) {
  const { t } = useTranslation('landing')
  return (
    <figure
      className={`space-y-4 rounded-2xl p-6 ${featured ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}
    >
      <div className="flex gap-0.5" aria-label={t('testimonials.rating')}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`size-4 fill-current ${featured ? '' : 'text-primary'}`}
            aria-hidden
          />
        ))}
      </div>
      <blockquote className="text-lg leading-snug">
        {t(`testimonials.items.${id}.quote`)}
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <img
          src={`https://randomuser.me/api/portraits/${avatar}.jpg`}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="size-10 rounded-full object-cover"
        />
        <span className="text-sm">
          <span className="block font-semibold">{t(`testimonials.items.${id}.name`)}</span>
          <span className={featured ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
            {t(`testimonials.items.${id}.role`)}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  const { t } = useTranslation('landing')
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const desktop = useDesktop()
  const shifts = [
    useShift(scrollYProgress, 50, -50),
    useShift(scrollYProgress, -30, 30),
    useShift(scrollYProgress, 60, -40),
  ]

  return (
    <section ref={ref} className={`${wrap} space-y-10 py-16 md:py-24`}>
      <h2 className="max-w-[22ch] text-3xl font-bold tracking-tight text-balance md:text-4xl">
        {t('testimonials.title')}
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((items, c) => (
          <motion.div key={c} style={{ y: desktop ? shifts[c] : 0 }} className="space-y-4">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                <Card {...item} />
              </Reveal>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
