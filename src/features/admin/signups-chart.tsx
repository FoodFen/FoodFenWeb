import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { signups } from './mock-overview'

const config = { users: { label: 'Người dùng mới', color: 'var(--chart-1)' } } satisfies ChartConfig

export function SignupsChart() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Người dùng mới theo ngày</CardTitle>
        <CardDescription>14 ngày gần nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <AreaChart accessibilityLayer data={signups} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="users"
              type="monotone"
              stroke="var(--color-users)"
              strokeWidth={2}
              fill="var(--color-users)"
              fillOpacity={0.15}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
