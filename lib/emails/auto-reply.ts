import { site } from "@/lib/site";

export type AutoReplyInput = {
  name: string;
  service?: string;
  budget?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function contactAutoReplyText({ name, service, budget }: AutoReplyInput) {
  const details = [
    service ? `Service: ${service}` : null,
    budget ? `Budget: ${budget}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    `Hi ${name},`,
    "",
    "Thanks for reaching out to KDV Website Services. I received your message and will reply within 1 business day (PH time).",
    details ? `\nYour inquiry details:\n${details}` : null,
    "",
    `If you want to skip the back-and-forth, you can also book a 15-minute call here: ${site.calBookingUrl}`,
    "",
    `Recent work: ${site.url}/portfolio`,
    "",
    "Keith",
    "KDV Website Services",
  ]
    .filter(Boolean)
    .join("\n");
}

export function contactAutoReplyHtml(input: AutoReplyInput) {
  const safeName = escapeHtml(input.name);
  const details = [
    input.service ? `<li><strong>Service:</strong> ${escapeHtml(input.service)}</li>` : null,
    input.budget ? `<li><strong>Budget:</strong> ${escapeHtml(input.budget)}</li>` : null,
  ]
    .filter(Boolean)
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;background:#080808;color:#f5f5f5;font-family:Arial,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:32px 20px;">
      <div style="border:1px solid rgba(255,255,255,0.12);border-radius:18px;background:#101010;padding:28px;">
        <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#a5b4fc;">KDV Website Services</div>
        <h1 style="margin:18px 0 0;font-size:28px;line-height:1.15;color:#ffffff;">Got your message.</h1>
        <p style="margin:18px 0 0;font-size:15px;line-height:1.65;color:rgba(255,255,255,0.72);">Hi ${safeName}, thanks for reaching out. I received your inquiry and will reply within 1 business day (PH time).</p>
        ${
          details
            ? `<ul style="margin:18px 0 0;padding-left:20px;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.68);">${details}</ul>`
            : ""
        }
        <p style="margin:20px 0 0;font-size:15px;line-height:1.65;color:rgba(255,255,255,0.72);">If you want to skip the back-and-forth, you can book a 15-minute call.</p>
        <p style="margin:22px 0 0;">
          <a href="${site.calBookingUrl}" style="display:inline-block;border-radius:999px;background:#8b5cf6;color:#ffffff;text-decoration:none;padding:12px 18px;font-weight:700;">Book a 15-minute call</a>
        </p>
        <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.46);">Recent work: <a href="${site.url}/portfolio" style="color:#c4b5fd;">${site.url}/portfolio</a></p>
      </div>
    </div>
  </body>
</html>`;
}
