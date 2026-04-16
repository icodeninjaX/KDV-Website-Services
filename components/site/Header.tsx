"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold" aria-label="KDV Website Services — home">
          <Logo height={44} />
          <span className="hidden text-sm font-medium text-white/50 sm:inline">Website Services</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/contact">
            <Button size="sm">Start a project</Button>
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden rounded-lg p-2 text-white/70 hover:bg-white/5 hover:text-white"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/5 md:hidden",
          open ? "max-h-96" : "max-h-0",
          "transition-[max-height] duration-300",
        )}
      >
        <div className="container-page flex flex-col gap-1 py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
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
