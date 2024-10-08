import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  // focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-rounded-full
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',

        // custom colors
        blue: 'text-blue-600 bg-blue-100 border-none border-transparent',
        rose: 'text-rose-600 bg-rose-100 border-none border-transparent',
        orange: 'text-orange-600 bg-orange-100 border-none border-transparent',
        green: 'text-green-600 bg-green-100 border-none border-transparent',
        purple: 'text-purple-600 bg-purple-100 border-none border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
