"use client"

import { TrendingUp } from 'lucide-react'
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface LineChartData {
  month: string
  numPassengers: number
}

interface LineChartDataProps {
  lineChartData: LineChartData[]
}

const chartConfig = {
  numPassengers: {
    label: "Number of Passengers",
    color: "hsl(var(--chart-1))",
  },
}

const Chart: React.FC<LineChartDataProps> = ({ lineChartData }) => {
  // Ensure there's always at least one data point
  const chartData = lineChartData.length > 0 ? lineChartData : [{ month: "No Data", numPassengers: 0 }]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Passengers per Month</CardTitle>
        <CardDescription>Monthly passenger data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="numPassengers"
              type="monotone"
              stroke="var(--color-numPassengers)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-numPassengers)",
                r: 6,
              }}
              activeDot={{
                r: 8,
              }}
            >
              <LabelList
                dataKey="numPassengers"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {chartData[0].numPassengers > 0 ? (
            <>
              {chartData[0].numPassengers} passengers in {chartData[0].month} <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            "No passenger data available"
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing passenger data for the available month
        </div>
      </CardFooter>
    </Card>
  )
}

export default Chart
