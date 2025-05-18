import * as React from "react"

const Chart = () => {
  return null
}

interface ChartTooltipItemProps {
  name?: string
  value?: string | number
  color?: string
}

const ChartTooltipItem = React.forwardRef<HTMLSpanElement, ChartTooltipItemProps>(({ name, value, color }, ref) => {
  return (
    <div className="flex items-center space-x-2">
      {color && <span className="block h-4 w-4 rounded-full" style={{ backgroundColor: color }} />}
      <span>
        {name}: {value}
      </span>
    </div>
  )
})
ChartTooltipItem.displayName = "ChartTooltipItem"

interface ChartLegendItemProps {
  name: string
  color: string
}

const ChartLegendItem = React.forwardRef<HTMLDivElement, ChartLegendItemProps>(({ name, color }, ref) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="block h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
      <span>{name}</span>
    </div>
  )
})
ChartLegendItem.displayName = "ChartLegendItem"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="rounded-md border bg-popover p-4 text-sm text-popover-foreground shadow-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100"
        {...props}
      />
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const ChartLegend = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-wrap">{children}</div>
}

const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export { Chart, ChartTooltip, ChartTooltipContent, ChartTooltipItem, ChartLegend, ChartLegendItem, ChartContainer }
