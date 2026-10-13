import { z } from 'zod'

export const restaurantTabs = ['all', 'pending', 'approved', 'rejected'] as const
export type RestaurantTab = (typeof restaurantTabs)[number]

export const restaurantSearchSchema = z.object({
  tab: z.enum(restaurantTabs).optional().catch(undefined),
})

export const tabLabels: Record<RestaurantTab, string> = {
  all: 'Tất cả',
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Bị từ chối',
}

export const emptyMessages: Record<RestaurantTab, string> = {
  all: 'Quán mới đăng ký sẽ xuất hiện ở đây.',
  pending: 'Quán và món mới gửi lên sẽ xuất hiện ở đây để chờ duyệt.',
  approved: 'Các quán đã được duyệt sẽ xuất hiện ở đây.',
  rejected: 'Các quán bị từ chối sẽ xuất hiện ở đây.',
}
