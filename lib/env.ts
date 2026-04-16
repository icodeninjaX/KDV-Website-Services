export const env = {
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL ?? "keithvergara1997@gmail.com",
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
} as const;

export const hasResend = Boolean(env.RESEND_API_KEY);
