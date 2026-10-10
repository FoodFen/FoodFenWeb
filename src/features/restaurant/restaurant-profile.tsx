import type { RestaurantResponse } from '@/api/generated'
import { RestaurantSummary } from '@/components/restaurant-summary'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { RestaurantForm } from './restaurant-form'
import { toRestaurantValues } from './restaurant-schema'
import { useUpdateRestaurant } from './use-restaurant'

type Props = { restaurant: RestaurantResponse; upload: (file: File) => Promise<string> }

export function RestaurantProfile({ restaurant, upload }: Props) {
  const [editing, setEditing] = useState(false)
  const update = useUpdateRestaurant()

  if (editing) {
    const rejected = restaurant.status === 'rejected'
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Sửa thông tin quán</h2>
        {rejected && (
          <p className="text-muted-foreground text-sm">Sau khi lưu, quán sẽ được gửi duyệt lại.</p>
        )}
        <RestaurantForm
          defaultValues={toRestaurantValues(restaurant)}
          submitLabel={rejected ? 'Lưu và gửi duyệt lại' : 'Lưu thay đổi'}
          upload={upload}
          onSubmit={async (values) => {
            await update(values)
            setEditing(false)
          }}
        />
        <Button variant="ghost" className="h-11 px-4" onClick={() => setEditing(false)}>
          Huỷ
        </Button>
      </div>
    )
  }

  return (
    <RestaurantSummary
      restaurant={restaurant}
      actions={
        <Button variant="outline" className="h-11 px-4" onClick={() => setEditing(true)}>
          <Pencil aria-hidden />
          Sửa thông tin
        </Button>
      }
    />
  )
}
