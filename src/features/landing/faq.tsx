import { ChevronDown } from 'lucide-react'
import { wrap } from './shared'

const faqs = [
  {
    q: 'FoodFen có miễn phí không?',
    a: 'Có. Bạn ghi nhật ký và dùng nhận diện bằng ảnh miễn phí. Premium mở thêm các tính năng nâng cao.',
  },
  {
    q: 'Nhận diện món ăn chính xác đến đâu?',
    a: 'Kết quả là ước tính. Bạn luôn có thể sửa nguyên liệu và khẩu phần trước khi lưu.',
  },
  {
    q: 'Dữ liệu sức khỏe của tôi có được bảo mật không?',
    a: 'Cân nặng và nhật ký ăn uống thuộc về tài khoản của bạn và không hiển thị cho người khác.',
  },
  {
    q: 'Tôi có dùng được trên điện thoại không?',
    a: 'Có. FoodFen có ứng dụng iOS và Android, đồng bộ với bản web.',
  },
]

export function Faq() {
  return (
    <section id="hoi-dap" className={`${wrap} space-y-6 py-16 md:py-24`}>
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Câu hỏi thường gặp</h2>
      <div className="bg-card max-w-2xl divide-y rounded-2xl border">
        {faqs.map(({ q, a }) => (
          <details key={q} className="group px-5 py-2">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {q}
              <ChevronDown
                className="text-muted-foreground size-5 shrink-0 transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="text-muted-foreground pb-3">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
