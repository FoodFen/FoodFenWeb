import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { Reveal } from './parts'
import { big, wrap } from './shared'

const premium = [
  'Chất xơ chi tiết cho từng món',
  'Thêm lượt nhận diện bằng AI mỗi ngày',
  'Đổi xu tích lũy thành ngày Premium',
]

export function Premium() {
  return (
    <section className={`${wrap} py-8 md:py-16`}>
      <Reveal>
        <div className="bg-secondary grid gap-8 rounded-2xl p-8 md:grid-cols-2 md:items-center md:p-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Miễn phí để bắt đầu. Premium khi bạn cần nhiều hơn.
            </h2>
            <Link
              to="/register"
              className={buttonVariants({
                className: `${big} bg-cta text-cta-foreground hover:bg-cta/90`,
              })}
            >
              Nâng cấp Premium
            </Link>
          </div>
          <ul className="space-y-4">
            {premium.map((item) => (
              <li key={item} className="flex items-start gap-3 text-lg">
                <Check className="text-primary mt-1 size-5 shrink-0" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
