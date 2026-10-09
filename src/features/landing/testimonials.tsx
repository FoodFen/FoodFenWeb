import { Star } from 'lucide-react'
import { useScroll } from 'motion/react'
import { motion } from 'motion/react'
import { useRef } from 'react'
import { Reveal } from './parts'
import { useDesktop, useShift, wrap } from './shared'

// Mock testimonials: invented people and quotes, portraits from randomuser.me.
type Item = { quote: string; name: string; role: string; avatar: string; featured?: boolean }

const columns: Item[][] = [
  [
    {
      quote:
        'Trước đây mình toàn đoán calo bằng mắt. Giờ chụp một tấm là có đủ protein, carb, béo.',
      name: 'Nguyễn Minh Anh',
      role: 'Nhân viên văn phòng, TP.HCM',
      avatar: 'women/44',
    },
    {
      quote:
        'Mình dạy gym nên cần số liệu nhanh cho học viên. Sửa khẩu phần xong là lưu luôn, rất gọn.',
      name: 'Phạm Gia Bảo',
      role: 'Huấn luyện viên, Đà Nẵng',
      avatar: 'men/75',
    },
  ],
  [
    {
      quote:
        'Hỏi trợ lý AI nên ăn gì tối nay để đủ protein, nó trả lời đúng theo mục tiêu của mình.',
      name: 'Võ Ngọc Lan',
      role: 'Nhân viên marketing, Cần Thơ',
      avatar: 'women/68',
      featured: true,
    },
    {
      quote: 'Chuỗi ngày ghi nhật ký làm mình lười mấy cũng phải mở app mỗi tối.',
      name: 'Trần Quốc Huy',
      role: 'Sinh viên, Hà Nội',
      avatar: 'men/32',
    },
  ],
  [
    {
      quote: 'Nhận ra cả tô phở lẫn bánh mì. Món nào sai thì mình chỉnh lại trong vài giây.',
      name: 'Đặng Hoàng Nam',
      role: 'Kỹ sư phần mềm, Hải Phòng',
      avatar: 'men/46',
    },
    {
      quote: 'Mình ăn uống lại sau sinh, app giúp mình thấy rõ hôm nào ăn thiếu bữa.',
      name: 'Bùi Khánh Linh',
      role: 'Mẹ bỉm sữa, Huế',
      avatar: 'women/12',
    },
  ],
]

function Card({ quote, name, role, avatar, featured }: Item) {
  return (
    <figure
      className={`space-y-4 rounded-2xl p-6 ${featured ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}
    >
      <div className="flex gap-0.5" aria-label="5 trên 5 sao">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`size-4 fill-current ${featured ? '' : 'text-primary'}`}
            aria-hidden
          />
        ))}
      </div>
      <blockquote className="text-lg leading-snug">{quote}</blockquote>
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
          <span className="block font-semibold">{name}</span>
          <span className={featured ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
            {role}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
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
        Người dùng nói gì về FoodFen
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((items, c) => (
          <motion.div key={c} style={{ y: desktop ? shifts[c] : 0 }} className="space-y-4">
            {items.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.1}>
                <Card {...item} />
              </Reveal>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
