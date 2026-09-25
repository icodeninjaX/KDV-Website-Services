import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { paperAtlas, plateAspect, storyChapters, storyPlates, type StoryChapter } from "@/lib/story";

/**
 * Static telling of the story — the default server render, and what reduced-motion,
 * data-saving, no-WebGL, and no-JS visitors see.
 */
export function StoryChapters() {
  return (
    <div className="container-page space-y-16 pb-8 pt-8 sm:space-y-20 md:pt-16">
      {storyChapters.slice(1).map((chapter, i) => (
        <div key={chapter.id} className="grid items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
          <div className={i % 2 ? "md:order-2" : undefined}>
            <ChapterText chapter={chapter} />
          </div>
          <ChapterVisual chapter={chapter} />
        </div>
      ))}
    </div>
  );
}

function ChapterVisual({ chapter }: { chapter: StoryChapter }) {
  if (!("plate" in chapter)) {
    return (
      <div aria-hidden className="relative overflow-hidden rounded-xl border border-border bg-card" style={{ aspectRatio: plateAspect }}>
        <Image src={paperAtlas.src} alt="" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover opacity-80" />
      </div>
    );
  }
  const plate = storyPlates[chapter.plate];
  return (
    <figure>
      <div className="relative overflow-hidden rounded-xl border border-border bg-card" style={{ aspectRatio: plateAspect }}>
        <Image src={plate.src} alt={plate.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover object-left-top" />
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        {plate.project} / {plate.client} / {plate.screen}
      </figcaption>
    </figure>
  );
}

function ChapterText({ chapter }: { chapter: StoryChapter }) {
  const plate = "plate" in chapter ? storyPlates[chapter.plate] : null;
  return (
    <>
      <p className="label-mono">{chapter.label}</p>
      <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">{chapter.heading}</h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{chapter.body}</p>
      {chapter.kind === "service" && (
        <p className="mt-4 text-sm text-foreground">
          {chapter.service.startingAt.startsWith("₱") ? `From ${chapter.service.startingAt}` : chapter.service.startingAt}
          <span className="mx-2 text-muted-foreground" aria-hidden>/</span>
          {chapter.service.timeline}
        </p>
      )}
      {plate && (
        <div className="mt-4 flex flex-wrap gap-x-5">
          <ChapterLink href={`/portfolio/${plate.slug}`}>Read the {plate.project} case study</ChapterLink>
          {chapter.kind === "service" && <ChapterLink href={`/services/${chapter.service.slug}`}>{chapter.service.title}</ChapterLink>}
        </div>
      )}
    </>
  );
}

function ChapterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2 rounded font-medium hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children} <ArrowRight size={16} aria-hidden />
    </Link>
  );
}
