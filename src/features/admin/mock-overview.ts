import { Crown, ScanLine, Trophy, UserPlus, UtensilsCrossed, type LucideIcon } from 'lucide-react'

// Mock data for the admin overview: replace with API data.
export const kpis: { icon: LucideIcon; label: string; value: number; delta: number }[] = [
  { icon: UserPlus, label: 'Người dùng mới hôm nay', value: 88, delta: 15.8 },
  { icon: UtensilsCrossed, label: 'Bữa ăn được ghi hôm nay', value: 12480, delta: 6.3 },
  { icon: Crown, label: 'Người dùng Premium', value: 3217, delta: 2.1 },
  { icon: ScanLine, label: 'Lượt nhận diện AI hôm nay', value: 4126, delta: -3.4 },
]

const signupDays = [
  ['25/09', 41],
  ['26/09', 38],
  ['27/09', 52],
  ['28/09', 47],
  ['29/09', 63],
  ['30/09', 58],
  ['01/10', 44],
  ['02/10', 49],
  ['03/10', 67],
  ['04/10', 72],
  ['05/10', 65],
  ['06/10', 81],
  ['07/10', 76],
  ['08/10', 88],
] as const
export const signups = signupDays.map(([day, users]) => ({ day, users }))

export const activity: { icon: LucideIcon; text: string; time: string }[] = [
  { icon: Crown, text: 'Nguyễn Minh Anh nâng cấp Premium', time: 'Vừa xong' },
  { icon: Trophy, text: 'Trần Quốc Huy hoàn thành nhiệm vụ tuần', time: '12 phút trước' },
  { icon: UserPlus, text: 'Bùi Khánh Linh tạo tài khoản mới', time: '31 phút trước' },
  { icon: ScanLine, text: 'Phạm Gia Bảo nhận diện 6 món trong một ngày', time: '1 giờ trước' },
  { icon: Crown, text: 'Võ Ngọc Lan đổi 600 xu lấy 10 ngày Premium', time: '2 giờ trước' },
  { icon: UserPlus, text: 'Đặng Hoàng Nam tạo tài khoản mới', time: '3 giờ trước' },
]
