import type { DashboardDayResponse } from '@/api/generated'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatShortDate } from '@/lib/format'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

type Series = { key: Exclude<keyof DashboardDayResponse, 'date'>; label: string; color: string }

type Props = {
  title: string
  description: string
  rows: DashboardDayResponse[]
  series: Series[]
  /** Stack the series on top of each other (parts of one total, like revenue sources). */
  stacked?: boolean
}

export function DailyChart({ title, description, rows, series, stacked = false }: Props) {
  const config = Object.fromEntries(
    series.map(({ key, label, color }) => [key, { label, color }]),
  ) satisfies ChartConfig

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <AreaChart accessibilityLayer data={rows} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tickFormatter={formatShortDate}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(label) => formatShortDate(String(label))}
                />
              }
            />
            {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
            {series.map(({ key }) => (
              <Area
                key={key}
                dataKey={key}
                type="monotone"
                stackId={stacked ? 'total' : undefined}
                stroke={`var(--color-${key})`}
                strokeWidth={2}
                fill={`var(--color-${key})`}
                fillOpacity={0.15}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
