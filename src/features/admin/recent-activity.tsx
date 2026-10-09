import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { activity } from './mock-overview'

export function RecentActivity() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activity.map(({ icon: Icon, text, time }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="bg-secondary text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="space-y-0.5 text-sm">
                <span className="block">{text}</span>
                <span className="text-muted-foreground block text-xs">{time}</span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
