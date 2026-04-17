import { trustLogos } from "@/lib/logos";
import { FadeIn } from "./FadeIn";
import { LogoMark } from "./LogoMark";

export function TrustBar() {
  return (
    <section
      aria-labelledby="trust-bar-heading"
      className="border-y border-white/[0.06] bg-white/[0.015]"
    >
      <div className="container-page py-10">
        <FadeIn>
          <h2 id="trust-bar-heading" className="label-mono text-center">
            Payments &amp; stack I build with
          </h2>
        </FadeIn>

        {/* Accessible list for screen readers */}
        <ul className="sr-only">
          {trustLogos.map((logo) => (
            <li key={logo.name}>{logo.name}</li>
          ))}
        </ul>

        {/* Animated marquee — decorative */}
        <div
          aria-hidden
          className="group relative mt-6 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div className="flex w-max animate-marquee items-center motion-reduce:animate-none group-hover:[animation-play-state:paused] will-change-transform">
            {[...trustLogos, ...trustLogos].map((logo, i) => (
              <span
                key={`${logo.name}-${i}`}
                className="mx-6 flex items-center sm:mx-10"
              >
                <LogoMark item={logo} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
