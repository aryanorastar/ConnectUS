import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  max?: number;
  height?: string; // e.g., 'h-2', 'h-4', 'h-8'
  colorClass?: string; // e.g., 'bg-primary', 'bg-green-500'
  label?: string | React.ReactNode;
  labelClass?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(({ className, value = 0, max = 100, height = "h-2", colorClass = "bg-primary", label, labelClass = "text-sm font-semibold text-foreground", ...props }, ref) => (
  <div className="w-full">
    {label && (
      <div className={cn("mb-1 flex justify-between items-center", labelClass)}>
        <span>{label}</span>
        <span>{Math.round(value)}/{max}</span>
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      max={max}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-secondary/60",
        height,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("transition-all", colorClass, "rounded-full", height)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
