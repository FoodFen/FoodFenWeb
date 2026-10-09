import { IconBadge } from '@/components/icon-badge'
import { Camera, ChartLine, ListChecks } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { wrap } from './shared'
import { Photo } from '@/components/photo'
import { ids } from '@/lib/photos'

const steps = [
  {
    verb: 'Chụp',
    icon: Camera,
    text: 'Chụp món ăn hoặc chọn ảnh có sẵn. Bạn cũng có thể gõ hoặc nói tên món.',
    id: ids.bowl,
    alt: 'Tô cơm cá hồi nhìn từ trên xuống',
  },
  {
    verb: 'Xác nhận',
    icon: ListChecks,
    text: 'Xem danh sách nguyên liệu, sửa khẩu phần nếu cần rồi lưu vào nhật ký.',
    id: ids.plate,
    alt: 'Đĩa cá hồi, đậu que và ngũ cốc',
  },
  {
    verb: 'Theo dõi',
    icon: ChartLine,
    text: 'Đối chiếu với mục tiêu trong ngày và xem xu hướng của cả tuần.',
    id: ids.breakfast,
    alt: 'Bàn bữa sáng với yến mạch và trái cây',
  },
]

function Step({
  index,
  active,
  onActive,
}: {
  index: number
  active: boolean
  onActive: (i: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])
  const { verb, text, icon } = steps[index]
  return (
    <div ref={ref} className="flex min-h-[55vh] items-center md:min-h-[75vh]">
      <div
        className={`space-y-3 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-30'}`}
      >
        <IconBadge icon={icon} className="bg-primary/10 text-primary" />
        <p className="text-primary text-5xl font-bold tracking-tight md:text-7xl">{verb}</p>
        <p className="text-muted-foreground max-w-[40ch] text-lg">{text}</p>
      </div>
    </div>
  )
}

export function Steps() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  return (
    <section id="cach-hoat-dong" className={`${wrap} py-16 md:py-24`}>
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ba thao tác cho mỗi bữa ăn</h2>
      <div className="mt-6 grid md:mt-10 md:grid-cols-2 md:gap-12">
        <div className="bg-background sticky top-16 z-10 -mx-4 px-4 py-3 md:top-24 md:mx-0 md:self-start md:bg-transparent md:p-0">
          <div className="bg-secondary relative h-56 overflow-hidden rounded-2xl md:h-[30rem]">
            {steps.map(({ id, alt }, i) => (
              <motion.div
                key={id}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.08 }}
                transition={{ duration: reduce ? 0 : 0.7 }}
              >
                <Photo id={id} alt={alt} w={800} h={900} className="size-full" />
              </motion.div>
            ))}
          </div>
        </div>
        <ol>
          {steps.map(({ verb }, i) => (
            <li key={verb}>
              <Step index={i} active={active === i} onActive={setActive} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
