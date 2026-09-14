"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Calculator, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type EstimatorScope,
  type EstimatorService,
  type EstimatorUrgency,
  formatPeso,
  getEstimate,
} from "@/lib/estimator";
import { services } from "@/lib/services";

const scopeOptions: { value: EstimatorScope; label: string; description: string }[] = [
  {
    value: "small",
    label: "Small",
    description: "Focused launch, a few screens, or one core workflow.",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Several pages, roles, reports, integrations, or workflow states.",
  },
  {
    value: "large",
    label: "Large",
    description: "Complex app, multiple teams, heavy data, or several integrations.",
  },
];

const scopeExamples: Record<EstimatorService, Record<EstimatorScope, string>> = {
  "website-creation": {
    small: "For example, a focused business website with service details and an inquiry form.",
    medium: "For example, a multi-page site with separate service pages and editable content.",
    large: "For example, an extensive content site with several integrations and page types.",
  },
  "business-dashboards": {
    small: "For example, one dashboard for tracking sales or member activity.",
    medium: "For example, several reports with staff roles and approval states.",
    large: "For example, reporting across branches, teams, and connected data sources.",
  },
  "custom-websites": {
    small: "For example, one booking, order, or member-management workflow.",
    medium: "For example, several connected workflows with staff roles and notifications.",
    large: "For example, an operations app spanning teams, payments, and external systems.",
  },
};

const urgencyOptions: { value: EstimatorUrgency; label: string; description: string }[] = [
  {
    value: "no-rush",
    label: "No rush",
    description: "Quality and fit matter more than a compressed launch.",
  },
  {
    value: "one-month",
    label: "Within 1 month",
    description: "The timeline is important, but scope can still be shaped.",
  },
  {
    value: "asap",
    label: "ASAP",
    description: "You need the first version fast and can decide quickly.",
  },
];

export function EstimatorWizard() {
  const [service, setService] = useState<EstimatorService>("website-creation");
  const [scope, setScope] = useState<EstimatorScope>("small");
  const [urgency, setUrgency] = useState<EstimatorUrgency>("no-rush");

  const result = useMemo(
    () => getEstimate({ service, scope, urgency }),
    [service, scope, urgency],
  );

  const selectedService = services.find((item) => item.slug === service);
  const contactHref = `/contact?service=${result.recommendedSlug}&budget=${result.budgetParam}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div className="rounded-2xl border border-white/[0.1] bg-[hsl(var(--card))] p-5 sm:p-7">
        <div className="label-mono">Project shape</div>

        <div className="mt-5 space-y-5">
          <div className="space-y-2">
            <label htmlFor="estimate-service" className="text-sm font-medium text-white">
              What are you building?
            </label>
            <select
              id="estimate-service"
              value={service}
              onChange={(event) => setService(event.target.value as EstimatorService)}
              className="h-11 w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 text-sm text-white transition-colors focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              {services.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
            <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
              {selectedService?.tagline}
            </p>
          </div>

          <OptionSelect
            id="estimate-scope"
            label="How big is the first version?"
            value={scope}
            options={scopeOptions.map((option) => ({ ...option, description: scopeExamples[service][option.value] }))}
            onChange={(value) => setScope(value as EstimatorScope)}
          />

          <OptionSelect
            id="estimate-urgency"
            label="How urgent is it?"
            value={urgency}
            options={urgencyOptions}
            onChange={(value) => setUrgency(value as EstimatorUrgency)}
          />
        </div>
      </div>

      <aside className="rounded-2xl border border-indigo-400/20 bg-[hsl(var(--card))] p-5 sm:p-7 lg:sticky lg:top-24">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-gradient-brand-soft text-[hsl(var(--foreground))]">
            <Calculator size={20} aria-hidden />
          </div>
          <div>
            <div className="label-mono">Estimated range</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">For planning only</div>
          </div>
        </div>

        <div role="status" aria-live="polite" aria-atomic="true">
        <p className="mt-5 text-sm text-[hsl(var(--muted-foreground))]">
          {selectedService?.title} · {scopeOptions.find((option) => option.value === scope)?.label} scope · {urgencyOptions.find((option) => option.value === urgency)?.label}
        </p>
        <div className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          {formatPeso(result.low)}
          <span className="block text-[hsl(var(--muted-foreground))]">to {formatPeso(result.high)}</span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
          {result.note}
        </p>

        </div>

        <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.035] p-4">
          <div className="flex items-start gap-3 text-sm text-[hsl(var(--muted-foreground))]">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[hsl(var(--foreground))]" aria-hidden />
            <p>
              Continue to the contact form with this service and budget range pre-selected.
            </p>
          </div>
        </div>

        <Link href={contactHref} className="mt-6 block">
          <Button className="w-full">
            Discuss this estimate <ArrowRight size={15} aria-hidden />
          </Button>
        </Link>
      </aside>
    </div>
  );
}

function OptionSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string; description: string }[];
  onChange: (value: string) => void;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 text-sm text-white transition-colors focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{selected?.description}</p>
    </div>
  );
}
