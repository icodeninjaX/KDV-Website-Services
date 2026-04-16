import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "relative bg-gradient-brand text-white shadow-[0_0_28px_-8px_rgba(99,102,241,0.5)] hover:shadow-[0_0_36px_-6px_rgba(99,102,241,0.7)] hover:-translate-y-px active:translate-y-0",
        secondary:
          "bg-white/[0.06] text-white backdrop-blur hover:bg-white/[0.1] border border-white/[0.1]",
        ghost: "text-white/60 hover:text-white hover:bg-white/[0.05]",
        outline:
          "border border-white/[0.15] bg-transparent text-white/80 hover:border-white/30 hover:bg-white/[0.05] hover:text-white",
      },
      size: {
        sm: "h-11 px-4 text-sm",   /* min 44px touch target */
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
