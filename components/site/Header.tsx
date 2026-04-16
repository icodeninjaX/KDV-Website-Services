"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[hsl(0_0%_3%/0.75)] backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
          aria-label="KDV Website Services — home"
        >
          <Logo height={36} />
          <span className="hidden text-sm font-medium text-white/40 sm:inline tracking-wide">
            Website Services
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-0.5 md:flex">
          {nav.map((item) => {
            const active = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70",
                  active
                    ? "text-white"
                    : "text-white/55 hover:text-white hover:bg-white/[0.05]",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 bottom-0.5 h-px bg-gradient-brand rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link href="/contact">
            <Button size="sm">Start a project</Button>
          </Link>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden rounded-md p-2 text-white/60 hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/[0.07] md:hidden",
          open ? "max-h-96" : "max-h-0",
          "transition-[max-height] duration-200",
        )}
      >
        <div className="container-page flex flex-col gap-1 py-3">
          {nav.map((item) => {
            const active = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70",
                  active
                    ? "text-white bg-white/[0.06]"
                    : "text-white/70 hover:bg-white/[0.05] hover:text-white",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/contact" onClick={() => setOpen(false)} className="mt-2">
            <Button className="w-full" size="sm">
              Start a project
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
