"use client";

import { usePathname } from "next/navigation";
import { SiWhatsapp } from "react-icons/si";
import { site } from "@/lib/site";

const HIDDEN_ROUTES = ["/contact"];

export function MobileChatPill() {
  const pathname = usePathname();
  const hidden = HIDDEN_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
  if (hidden) return null;

  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Keith on WhatsApp"
      className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-[#25D366] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0_0%_4%)] md:hidden"
    >
      <SiWhatsapp size={26} aria-hidden />
    </a>
  );
}
