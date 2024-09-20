"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const progressVariant = cva(
  "h-full w-full flex-1 bg-[#0d6dfc] transition-all",
  {
    variants: {
      variant: {
        default: "bg-[#0d6dfc]",
        success: "bg-emerald-700"
      },
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof progressVariant> {}

type CombinedProgressProps = ProgressProps & React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CombinedProgressProps
>(({ className, value, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        progressVariant({variant})
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
