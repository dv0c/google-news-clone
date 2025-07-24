import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // ✅ Filled - primary action
        filled: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400 dark:focus-visible:ring-blue-300",
        tonal: "bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 dark:focus-visible:ring-blue-700",
        outlined: "border border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-400 dark:border-blue-300 dark:text-blue-300 dark:hover:bg-blue-950",
        text: "text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-300 dark:text-blue-300 dark:hover:bg-blue-950",
        elevated: "bg-white text-blue-700 shadow-sm hover:shadow-md hover:bg-blue-50 focus-visible:ring-blue-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 dark:bg-red-500 dark:hover:bg-red-400 dark:focus-visible:ring-red-300",
        neutral: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",

        // ✅ Ghost - transparent with hover feedback
        ghost: "bg-transparent text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-300 dark:text-blue-300 dark:hover:bg-blue-950",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "default",
    },
  }
)


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
