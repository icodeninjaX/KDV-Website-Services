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
      <div className="rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-5 sm:p-7">
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
            <p className="text-xs leading-relaxed text-white/45">
              {selectedService?.summary}
            </p>
          </div>

          <OptionSelect
            id="estimate-scope"
            label="How big is the first version?"
            value={scope}
            options={scopeOptions}
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

      <aside className="rounded-2xl border border-indigo-400/20 bg-[hsl(0_0%_6%)] p-5 shadow-[0_0_40px_-24px_rgba(99,102,241,0.9)] sm:p-7 lg:sticky lg:top-24">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-gradient-brand-soft text-indigo-300">
            <Calculator size={20} aria-hidden />
          </div>
          <div>
            <div className="label-mono">Estimated range</div>
            <div className="mt-1 text-sm text-white/50">For planning only</div>
          </div>
        </div>

        <div className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          {formatPeso(result.low)}
          <span className="block text-white/45">to {formatPeso(result.high)}</span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/60">
          {result.note}
        </p>

        <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.035] p-4">
          <div className="flex items-start gap-3 text-sm text-white/70">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-indigo-300" aria-hidden />
            <p>
              Continue to the contact form with this service and budget range pre-selected.
            </p>
          </div>
        </div>

        <Link href={contactHref} className="mt-6 block">
          <Button className="w-full">
            Continue to contact <ArrowRight size={15} aria-hidden />
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
      <p className="text-xs leading-relaxed text-white/45">{selected?.description}</p>
    </div>
  );
}
