import { ProfilePage } from '@/features/auth/profile-page'
import { MyRestaurantCard } from '@/features/restaurant/my-restaurant-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/app/')({
  component: () => (
    <div className="max-w-xl space-y-8">
      <ProfilePage />
      <MyRestaurantCard />
    </div>
  ),
})
