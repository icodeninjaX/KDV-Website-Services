import { FadeIn } from "./FadeIn";

export function BrandVideo() {
  return (
    <section aria-labelledby="brand-video-heading" className="container-page py-16 sm:py-20">
      <FadeIn>
        <p className="label-mono">Watch / 1 minute</p>
        <h2 id="brand-video-heading" className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Still closing the day by hand?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          One minute on the chats, notebooks, and spreadsheets holding a business back, and what changes when it runs on
          one system.
        </p>
      </FadeIn>
      <FadeIn delay={0.06}>
        <video
          className="mt-10 block aspect-video h-auto w-full rounded-2xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          controls
          playsInline
          preload="none"
          poster="/video/still-counting-poster.webp"
          width={1920}
          height={1080}
          aria-describedby="brand-video-note"
        >
          <source src="/video/still-counting.webm" type="video/webm" />
          <source src="/video/still-counting.mp4" type="video/mp4" />
          <track kind="captions" src="/video/still-counting.en.vtt" srcLang="en" label="English" />
        </video>
        <p id="brand-video-note" className="mt-4 text-sm text-muted-foreground">
          Scenes are dramatized. Screens shown are real KDV client projects. Captions available.
        </p>
      </FadeIn>
    </section>
  );
}
