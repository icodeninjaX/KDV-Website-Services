"use server";

import { z } from "zod";
import { Resend } from "resend";
import { env, hasResend } from "@/lib/env";

const schema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Please enter a valid email"),
  company: z.string().max(200).optional().or(z.literal("")),
  budget: z.enum(["<₱50k", "₱50k-₱150k", "₱150k-₱500k", "₱500k+", "not-sure"]).optional(),
  service: z
    .enum(["website-creation", "business-dashboards", "custom-websites", "not-sure"])
    .optional(),
  message: z.string().min(10, "A little more detail helps me respond well").max(4000),
  website: z.string().max(0).optional(),
});

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const buckets = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = buckets.get(ip);
  if (!entry || entry.reset < now) {
    buckets.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

export async function sendContact(
  _prev: ContactResult | null,
  formData: FormData,
): Promise<ContactResult> {
  const ip = (formData.get("_ip") as string) || "anon";
  if (!rateLimit(ip)) {
    return { ok: false, error: "Too many requests. Please try again in a minute." };
  }

  const data = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    company: formData.get("company")?.toString() ?? "",
    budget: (formData.get("budget")?.toString() || undefined) as z.infer<typeof schema>["budget"],
    service: (formData.get("service")?.toString() || undefined) as z.infer<typeof schema>["service"],
    message: formData.get("message")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
  };

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  if (parsed.data.website) return { ok: true };

  const subject = `New inquiry from ${parsed.data.name}`;
  const lines = [
    `Name: ${parsed.data.name}`,
    `Email: ${parsed.data.email}`,
    parsed.data.company ? `Company: ${parsed.data.company}` : null,
    parsed.data.service ? `Service: ${parsed.data.service}` : null,
    parsed.data.budget ? `Budget: ${parsed.data.budget}` : null,
    "",
    parsed.data.message,
  ]
    .filter(Boolean)
    .join("\n");

  if (!hasResend) {
    console.info("[contact] RESEND_API_KEY missing — payload logged instead:\n" + lines);
    return { ok: true };
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: `KDV Website Services <${env.CONTACT_FROM_EMAIL}>`,
      to: env.CONTACT_TO_EMAIL,
      replyTo: parsed.data.email,
      subject,
      text: lines,
    });
    if (error) {
      console.error("[contact] Resend error", error);
      return { ok: false, error: "Email delivery failed. Please email me directly." };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return { ok: false, error: "Something went wrong. Please email me directly." };
  }
}
