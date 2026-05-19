"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  cloneElement,
  isValidElement,
  useActionState,
  useEffect,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendContact, type ContactResult } from "@/app/actions/contact";

const servicePrefill = new Set([
  "website-creation",
  "business-dashboards",
  "custom-websites",
  "not-sure",
]);

const budgetPrefill: Record<string, string> = {
  "under-50k": "<\u20b150k",
  "50k-150k": "\u20b150k-\u20b1150k",
  "150k-500k": "\u20b1150k-\u20b1500k",
  "500k-plus": "\u20b1500k+",
  "not-sure": "not-sure",
};

export function ContactForm() {
  const searchParams = useSearchParams();
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

  const consentId = useId();
  const service = searchParams.get("service") ?? "";
  const budget = searchParams.get("budget") ?? "";
  const defaultService = servicePrefill.has(service) ? service : "";
  const defaultBudget = budgetPrefill[budget] ?? "";

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
          <Select name="service" defaultValue={defaultService}>
            <option value="">Not sure yet</option>
            <option value="website-creation">Website creation</option>
            <option value="business-dashboards">Business dashboard</option>
            <option value="custom-websites">Custom website / web app</option>
            <option value="not-sure">Something else</option>
          </Select>
        </Field>
        <Field label="Budget range" error={err("budget")}>
          <Select name="budget" defaultValue={defaultBudget}>
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

      <div className="rounded-xl border border-white/[0.1] bg-white/[0.03] p-4">
        <div className="flex items-start gap-3">
          <input
            id={consentId}
            name="consent"
            type="checkbox"
            required
            aria-required="true"
            aria-invalid={!!err("consent")}
            aria-describedby={err("consent") ? `${consentId}-error` : undefined}
            className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-white/[0.06] text-indigo-500 accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          />
          <div>
            <label
              htmlFor={consentId}
              className="block min-h-11 cursor-pointer text-sm leading-relaxed text-white/70"
            >
              I agree to KDV Website Services processing my information to
              respond to this inquiry.
            </label>
            <p className="text-xs leading-relaxed text-white/35">
              Read the{" "}
              <Link
                href="/privacy"
                className="rounded text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        {err("consent") ? (
          <p id={`${consentId}-error`} className="mt-2 text-xs text-red-400" role="alert" aria-live="polite">
            {err("consent")}
          </p>
        ) : null}
      </div>

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
  children: ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const field = isValidElement<{ id?: string; "aria-describedby"?: string }>(children)
    ? cloneElement(children as ReactElement<{ id?: string; "aria-describedby"?: string }>, {
        id,
        "aria-describedby": error ? errorId : undefined,
      })
    : children;

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
      {field}
      {error ? (
        <p id={errorId} className="text-xs text-red-400" role="alert" aria-live="polite">
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
