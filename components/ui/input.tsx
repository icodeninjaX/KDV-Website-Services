import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/30 transition-colors focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500/40",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
