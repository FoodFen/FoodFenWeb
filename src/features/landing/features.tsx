import { IconBadge } from '@/components/icon-badge'
import { Camera, ChartLine, Flame, Target } from 'lucide-react'
import { Reveal } from './parts'
import { wrap } from './shared'
import { Photo } from '@/components/photo'
import { ids } from '@/lib/photos'

export function Features() {
  return (
    <section id="tinh-nang" className={`${wrap} space-y-8 py-16 md:py-24`}>
      <h2 className="max-w-[20ch] text-3xl font-bold tracking-tight text-balance md:text-4xl">
        Mọi thứ bạn cần để ăn uống có kiểm soát
      </h2>
      <div className="grid gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-4">
          <div className="group relative flex h-full min-h-80 flex-col justify-end gap-2 overflow-hidden rounded-2xl p-6 md:p-8">
            <Photo
              id={ids.salad}
              alt="Salad hạt và rau củ"
              w={1000}
              h={700}
              className="absolute inset-0 size-full transition-transform duration-700 group-hover:scale-105"
            />
            <div className="from-scrim/95 via-scrim/50 absolute inset-0 bg-gradient-to-t to-transparent" />
            <IconBadge icon={Camera} className="mb-auto bg-white/20 text-white backdrop-blur" />
            <h3 className="relative text-xl font-semibold text-white">Nhận diện món ăn bằng ảnh</h3>
            <p className="relative max-w-[48ch] text-white/90">
              Chụp hoặc chọn ảnh, FoodFen liệt kê nguyên liệu kèm khẩu phần ước tính. Bạn chỉnh lại
              trước khi lưu.
            </p>
          </div>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.1}>
          <div className="bg-primary text-primary-foreground flex h-full flex-col justify-end gap-2 rounded-2xl p-6 md:p-8">
            <IconBadge icon={Target} className="bg-primary-foreground/15 mb-auto" />
            <h3 className="text-xl font-semibold">Nhật ký theo mục tiêu</h3>
            <p className="text-primary-foreground/85">
              Đặt mục tiêu calo và macro, xem mỗi ngày bạn còn lại bao nhiêu.
            </p>
          </div>
        </Reveal>
        <Reveal className="md:col-span-2">
          <div className="bg-accent text-accent-foreground flex h-full min-h-56 flex-col justify-end gap-2 rounded-2xl p-6 md:p-8">
            <IconBadge icon={Flame} className="bg-primary/10 text-primary mb-auto" />
            <h3 className="text-xl font-semibold">Chuỗi ngày và nhiệm vụ</h3>
            <p className="text-accent-foreground/80">
              Giữ chuỗi ghi nhật ký, làm nhiệm vụ tuần và đổi xu lấy ngày Premium.
            </p>
          </div>
        </Reveal>
        <Reveal className="md:col-span-4" delay={0.1}>
          <div className="group bg-card grid h-full overflow-hidden rounded-2xl border sm:grid-cols-[1fr_0.8fr]">
            <div className="flex flex-col justify-end gap-2 p-6 md:p-8">
              <IconBadge icon={ChartLine} className="bg-primary/10 text-primary mb-auto" />
              <h3 className="text-xl font-semibold">Thống kê và trợ lý AI</h3>
              <p className="text-muted-foreground max-w-[40ch]">
                Xem xu hướng cân nặng, calo theo tuần, rồi hỏi trợ lý AI về chính bữa ăn của bạn.
              </p>
            </div>
            <div className="min-h-44 overflow-hidden">
              <Photo
                id={ids.berries}
                alt="Tô yến mạch với trái cây"
                w={600}
                h={500}
                className="size-full transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
