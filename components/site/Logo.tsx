import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  height = 44,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <Image
      src="/kdv-logo.jpg"
      alt="KDV"
      width={height}
      height={height}
      priority
      className={cn("select-none mix-blend-screen", className)}
      style={{ height, width: height }}
    />
  );
}
