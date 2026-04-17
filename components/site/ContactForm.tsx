"use client";

import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
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
    <form id="contact-form" action={formAction} className="space-y-5" noValidate aria-label="Contact form">
      {/* Honeypot */}
      <input type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden className="hidden" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={err("name")} required>
          <Input
            name="name"
            required
            placeholder="Keith Vergara"
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!err("name")}
          />
        </Field>
        <Field label="Email" error={err("email")} required>
          <Input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!err("email")}
          />
        </Field>
      </div>

      <Field label="Company" error={err("company")}>
        <Input name="company" placeholder="Acme Co." autoComplete="organization" />
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

      <Field label="Tell me about the project" error={err("message")} required>
        <Textarea
          name="message"
          required
          minLength={10}
          placeholder="What are you building? What's the goal? Any timeline pressure?"
          aria-required="true"
          aria-invalid={!!err("message")}
        />
      </Field>

      <div className="flex flex-col-reverse items-stretch gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/35">I&rsquo;ll reply within one business day.</p>
        <Button
          type="submit"
          disabled={pending}
          aria-disabled={pending}
          className="w-full sm:w-auto"
        >
          {pending ? (
            <>
              <Loader2 size={15} className="animate-spin" aria-hidden />
              Sending&hellip;
            </>
          ) : (
            <>
              Send message <Send size={15} aria-hidden />
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
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="ml-1 text-indigo-400/70" aria-hidden>
            *
          </span>
        )}
      </Label>
      {/* Clone child to pass id */}
      {children}
      {error ? (
        <p className="text-xs text-red-400" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-11 w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 text-sm text-white transition-colors focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
    >
      {children}
    </select>
  );
}
