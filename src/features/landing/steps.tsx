import { IconBadge } from '@/components/icon-badge'
import { Camera, ChartLine, ListChecks } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { wrap } from './shared'
import { Photo } from '@/components/photo'
import { ids } from '@/lib/photos'

const steps = [
  { key: 'capture', icon: Camera, id: ids.bowl },
  { key: 'confirm', icon: ListChecks, id: ids.plate },
  { key: 'track', icon: ChartLine, id: ids.breakfast },
] as const

function Step({
  index,
  active,
  onActive,
}: {
  index: number
  active: boolean
  onActive: (i: number) => void
}) {
  const { t } = useTranslation('landing')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])
  const { key, icon } = steps[index]
  return (
    <div ref={ref} className="flex min-h-[55vh] items-center md:min-h-[75vh]">
      <div
        className={`space-y-3 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-50'}`}
      >
        <IconBadge icon={icon} className="bg-primary/10 text-primary" />
        <p className="text-primary text-5xl font-bold tracking-tight md:text-7xl">
          {t(`steps.items.${key}.verb`)}
        </p>
        <p className="text-muted-foreground max-w-[40ch] text-lg">{t(`steps.items.${key}.text`)}</p>
      </div>
    </div>
  )
}

export function Steps() {
  const { t } = useTranslation('landing')
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  return (
    <section id="cach-hoat-dong" className={`${wrap} py-16 md:py-24`}>
      <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
        {t('steps.title')}
      </h2>
      <div className="mt-6 grid md:mt-10 md:grid-cols-2 md:gap-12">
        <div className="bg-background sticky top-16 z-10 -mx-4 px-4 py-3 md:top-24 md:mx-0 md:self-start md:bg-transparent md:p-0">
          <div className="bg-secondary relative h-56 overflow-hidden rounded-2xl md:h-[30rem]">
            {steps.map(({ key, id }, i) => (
              <motion.div
                key={id}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.08 }}
                transition={{ duration: reduce ? 0 : 0.7 }}
              >
                <Photo
                  id={id}
                  alt={t(`steps.items.${key}.alt`)}
                  w={800}
                  h={900}
                  className="size-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
        <ol>
          {steps.map(({ key }, i) => (
            <li key={key}>
              <Step index={i} active={active === i} onActive={setActive} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
