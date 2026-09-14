"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { MessageSquare, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./ContactForm";
import { CalEmbed } from "./CalEmbed";

type Tab = "form" | "book";
const tabs = ["form", "book"] as const;

export function ContactPanel() {
  const [tab, setTab] = useState<Tab>("form");
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "form" : event.key === "End" ? "book" : tab === "form" ? "book" : "form";
    setTab(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="min-w-0">
      <div role="tablist" aria-label="Contact options" className="mb-6 grid grid-cols-2 gap-1 rounded-2xl border border-border bg-muted p-1">
        {tabs.map((value) => (
          <Button
            key={value}
            ref={(node) => { tabRefs.current[value] = node; }}
            variant="ghost"
            role="tab"
            type="button"
            aria-selected={tab === value}
            aria-controls={`panel-${value}`}
            id={`tab-${value}`}
            tabIndex={tab === value ? 0 : -1}
            onKeyDown={onTabKeyDown}
            onClick={() => setTab(value)}
            className={`h-auto min-h-12 whitespace-normal rounded-xl px-2 py-3 text-sm ${tab === value ? "bg-background text-foreground" : "text-muted-foreground"}`}
          >
            {value === "form" ? <MessageSquare size={16} className="hidden shrink-0 sm:block" aria-hidden /> : <CalendarClock size={16} className="hidden shrink-0 sm:block" aria-hidden />}
            {value === "form" ? "Send a message" : "Book a 15-min call"}
          </Button>
        ))}
      </div>
      <div role="tabpanel" id="panel-form" aria-labelledby="tab-form" hidden={tab !== "form"}>
        <ContactForm />
      </div>
      <div role="tabpanel" id="panel-book" aria-labelledby="tab-book" hidden={tab !== "book"}>
        {tab === "book" && <CalEmbed />}
      </div>
    </div>
  );
}
