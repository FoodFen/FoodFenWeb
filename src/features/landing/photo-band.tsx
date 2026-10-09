import { motion, useScroll } from 'motion/react'
import { useRef } from 'react'
import { useShift, wrap } from './shared'
import { Photo } from '@/components/photo'
import { ids } from '@/lib/photos'

const rowA = [
  { id: ids.flatlay, alt: 'Đĩa trứng, rau và bơ' },
  { id: ids.steak, alt: 'Bò áp chảo với rau xà lách' },
  { id: ids.pomegranate, alt: 'Salad rau xanh với lựu' },
  { id: ids.table, alt: 'Salad bơ và rau củ' },
  { id: ids.market, alt: 'Các loại đậu và rau củ' },
  { id: ids.berries, alt: 'Tô yến mạch với trái cây' },
  { id: ids.salad, alt: 'Salad hạt và rau củ' },
  { id: ids.ramen, alt: 'Tô mì với tôm và trứng' },
]
const rowB = [
  { id: ids.pasta, alt: 'Nui trộn rau và cà chua' },
  { id: ids.pancake, alt: 'Chồng bánh pancake' },
  { id: ids.tacos, alt: 'Bánh taco với rau củ' },
  { id: ids.greenBowl, alt: 'Tô rau xanh trang trí hoa' },
  { id: ids.plate, alt: 'Đĩa cá hồi, đậu que và ngũ cốc' },
  { id: ids.breakfast, alt: 'Bàn bữa sáng với yến mạch và trái cây' },
  { id: ids.pho, alt: 'Tô phở bò' },
  { id: ids.buddha, alt: 'Tô rau củ và đậu gà' },
]

function Row({ items, x }: { items: typeof rowA; x: ReturnType<typeof useShift> }) {
  return (
    <motion.div style={{ x }} className="flex w-max gap-4 pl-4">
      {items.map(({ id, alt }) => (
        <Photo
          key={id}
          id={id}
          alt={alt}
          w={480}
          h={340}
          className="h-44 w-64 rounded-2xl md:h-60 md:w-80"
        />
      ))}
    </motion.div>
  )
}

export function PhotoBand() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const xA = useShift(scrollYProgress, 0, -420)
  const xB = useShift(scrollYProgress, -420, 0)

  return (
    <section ref={ref} className="space-y-8 overflow-hidden py-12 md:py-20">
      <div className={wrap}>
        <h2 className="max-w-[24ch] text-3xl font-bold tracking-tight text-balance md:text-4xl">
          Từ salad đến tô phở, chụp là có số liệu.
        </h2>
      </div>
      <div className="space-y-4">
        <Row items={rowA} x={xA} />
        <Row items={rowB} x={xB} />
      </div>
    </section>
  )
}
