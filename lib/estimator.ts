import type { Service } from "@/lib/services";

export type EstimatorService = Service["slug"];
export type EstimatorScope = "small" | "medium" | "large";
export type EstimatorUrgency = "no-rush" | "one-month" | "asap";

export type EstimateInput = {
  service: EstimatorService;
  scope: EstimatorScope;
  urgency: EstimatorUrgency;
};

export type EstimateResult = {
  low: number;
  high: number;
  recommendedSlug: EstimatorService;
  budgetParam: "under-50k" | "50k-150k" | "150k-500k" | "500k-plus";
  note: string;
};

const baseBands: Record<EstimatorService, Record<EstimatorScope, [number, number]>> = {
  "website-creation": {
    small: [25000, 45000],
    medium: [45000, 85000],
    large: [85000, 140000],
  },
  "business-dashboards": {
    small: [85000, 140000],
    medium: [140000, 260000],
    large: [260000, 500000],
  },
  "custom-websites": {
    small: [150000, 280000],
    medium: [280000, 650000],
    large: [650000, 1000000],
  },
};

const urgencyMultiplier: Record<EstimatorUrgency, number> = {
  "no-rush": 1,
  "one-month": 1.12,
  asap: 1.25,
};

function roundToFiveThousand(value: number) {
  return Math.round(value / 5000) * 5000;
}

function toBudgetParam(high: number): EstimateResult["budgetParam"] {
  if (high < 50000) return "under-50k";
  if (high <= 150000) return "50k-150k";
  if (high <= 500000) return "150k-500k";
  return "500k-plus";
}

export function formatPeso(value: number) {
  return `PHP ${new Intl.NumberFormat("en-PH").format(value)}`;
}

export function getEstimate(input: EstimateInput): EstimateResult {
  const [baseLow, baseHigh] = baseBands[input.service][input.scope];
  const multiplier = urgencyMultiplier[input.urgency];
  const low = roundToFiveThousand(baseLow * multiplier);
  const high = roundToFiveThousand(baseHigh * multiplier);

  return {
    low,
    high,
    recommendedSlug: input.service,
    budgetParam: toBudgetParam(high),
    note:
      input.urgency === "asap"
        ? "Rush timelines usually need tighter scope or a higher budget."
        : "This is a planning range, not a final quote. A discovery call confirms the real scope.",
  };
}
