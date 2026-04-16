"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendContact, type ContactResult } from "@/app/actions/contact";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactResult | null, FormData>(
    sendContact,
    null,
  );

  useEffect(() => {
    if (state?.ok) {
      toast.success("Message sent! I'll be in touch within one business day.");
      const form = document.getElementById("contact-form") as HTMLFormElement | null;
      form?.reset();
    } else if (state && !state.ok && !state.fieldErrors) {
      toast.error(state.error);
    }
  }, [state]);

  const err = (field: string) =>
    state && !state.ok ? state.fieldErrors?.[field] : undefined;

  return (
    <form id="contact-form" action={formAction} className="space-y-5" noValidate>
      <input type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden className="hidden" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={err("name")}>
          <Input name="name" required placeholder="Keith Vergara" />
        </Field>
        <Field label="Email" error={err("email")}>
          <Input name="email" type="email" required placeholder="you@company.com" />
        </Field>
      </div>

      <Field label="Company (optional)" error={err("company")}>
        <Input name="company" placeholder="Acme Co." />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="What do you need?" error={err("service")}>
          <Select name="service">
            <option value="">Not sure yet</option>
            <option value="website-creation">Website creation</option>
            <option value="business-dashboards">Business dashboard</option>
            <option value="custom-websites">Custom website / web app</option>
            <option value="not-sure">Something else</option>
          </Select>
        </Field>
        <Field label="Budget range" error={err("budget")}>
          <Select name="budget">
            <option value="">Not sure yet</option>
            <option value="<₱50k">Under ₱50k</option>
            <option value="₱50k-₱150k">₱50k – ₱150k</option>
            <option value="₱150k-₱500k">₱150k – ₱500k</option>
            <option value="₱500k+">₱500k+</option>
            <option value="not-sure">Prefer not to say</option>
          </Select>
        </Field>
      </div>

      <Field label="Tell me about the project" error={err("message")}>
        <Textarea
          name="message"
          required
          minLength={10}
          placeholder="What are you building? What's the goal? Any timeline pressure?"
        />
      </Field>

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-white/50">I'll reply within one business day.</p>
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : (
            <>
              Send message <Send size={16} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-violet-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-violet-500/20"
    >
      {children}
    </select>
  );
}
