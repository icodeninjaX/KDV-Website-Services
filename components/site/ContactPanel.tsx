"use client";

import { useState } from "react";
import { MessageSquare, CalendarClock } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { CalEmbed } from "./CalEmbed";

type Tab = "form" | "book";

export function ContactPanel() {
  const [tab, setTab] = useState<Tab>("form");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Contact options"
        className="mb-6 flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1"
      >
        <button
          role="tab"
          type="button"
          aria-selected={tab === "form"}
          aria-controls="panel-form"
          id="tab-form"
          onClick={() => setTab("form")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 ${
            tab === "form"
              ? "bg-white/10 text-white"
              : "text-white/55 hover:text-white"
          }`}
        >
          <MessageSquare size={15} aria-hidden />
          Send a message
        </button>
        <button
          role="tab"
          type="button"
          aria-selected={tab === "book"}
          aria-controls="panel-book"
          id="tab-book"
          onClick={() => setTab("book")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 ${
            tab === "book"
              ? "bg-white/10 text-white"
              : "text-white/55 hover:text-white"
          }`}
        >
          <CalendarClock size={15} aria-hidden />
          Book a 15-min call
        </button>
      </div>

      {tab === "form" ? (
        <div role="tabpanel" id="panel-form" aria-labelledby="tab-form">
          <ContactForm />
        </div>
      ) : (
        <div role="tabpanel" id="panel-book" aria-labelledby="tab-book">
          <CalEmbed />
        </div>
      )}
    </div>
  );
}
