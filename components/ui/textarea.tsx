import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-32 w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-y",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
