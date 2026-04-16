export const site = {
  name: "KDV Website Services",
  shortName: "KDV",
  tagline: "Websites, dashboards, and custom web apps built for Philippine businesses.",
  description:
    "KDV Website Services is a Philippines-based studio that designs and builds fast, conversion-focused websites, business dashboards, and custom web apps for MSMEs nationwide.",
  url: "https://kdvwebsiteservices.com",
  email: "keithvergara1997@gmail.com",
  founder: "Keith D. Vergara",
  responseWindow: "within 1 business day (PH time)",
  location: "Philippines — serving clients nationwide",
  country: "PH",
  currency: "PHP",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services/website-creation", label: "Services" },
  { href: "/portfolio", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
