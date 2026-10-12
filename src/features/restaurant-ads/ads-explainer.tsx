import { Info } from 'lucide-react'

const rules = [
  'Thanh toán để cả quán đủ điều kiện xuất hiện trong mục "Được tài trợ" của ứng dụng.',
  'Món của quán chỉ hiện với người dùng phù hợp với mục tiêu dinh dưỡng của họ.',
  'Mỗi lần hiển thị tối đa 3 quán, nên lượt hiển thị không được đảm bảo.',
  'Mua gói khi quảng cáo còn hạn sẽ cộng thêm thời gian từ ngày hết hạn hiện tại.',
  'Không hoàn tiền nếu quán bị gỡ do vi phạm quy định kiểm duyệt.',
]

export function AdsExplainer() {
  return (
    <section className="bg-muted/50 space-y-2 rounded-2xl p-4 text-sm">
      <h2 className="flex items-center gap-2 font-medium">
        <Info className="size-4" aria-hidden />
        Quảng cáo hoạt động thế nào
      </h2>
      <ul className="text-muted-foreground list-disc space-y-1 pl-5">
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </section>
  )
}
