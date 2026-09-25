import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { storyChapters, storyMedia, systemTiers, type StoryStill } from "@/lib/story";
import { Schematic } from "./StorySchematic";

/**
 * Static telling of the story — the default server render, and what mobile,
 * reduced-motion, data-saving, and no-JS visitors see.
 */
export function StoryChapters() {
  const [, connect, system, proof] = storyChapters;
  const { connected, system: systemStill } = storyMedia.stills;

  return (
    <div className="container-page space-y-16 pb-8 pt-8 sm:space-y-20 md:pt-16">
      <Chapter still={connected} schematic="connect">
        <ChapterText chapter={connect} />
      </Chapter>

      <Chapter still={systemStill} schematic="system" flip>
        <ChapterText chapter={system} />
        <ol className="mt-7 space-y-3">
          {systemTiers.map((tier, i) => (
            <li key={tier.service}>
              <Link
                href={`/services/${tier.service}`}
                className="group flex min-h-11 gap-4 rounded-lg border-l-2 border-primary py-1 pl-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>
                  <span className="font-medium text-foreground">
                    <span className="mr-2 font-mono text-sm text-muted-foreground">0{i + 1}</span>
                    {tier.title}
                  </span>
                  <span className="mt-1 block text-base leading-relaxed text-muted-foreground">{tier.role}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Chapter>

      <div className="grid items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
        <div>
          <ChapterText chapter={proof} />
          <Link
            href={`/portfolio/${storyMedia.proof.slug}`}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded font-medium hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Read the {storyMedia.proof.project} case study <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <figure>
          <div
            className="relative overflow-hidden rounded-xl border border-border bg-card"
            style={{ aspectRatio: `${storyMedia.proof.width} / ${storyMedia.proof.height}` }}
          >
            <Image src={storyMedia.proof.src} alt={storyMedia.proof.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-sm text-muted-foreground">
            {storyMedia.proof.project} / {storyMedia.proof.client} / actual admin dashboard
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

function Chapter({
  still,
  schematic,
  flip,
  children,
}: {
  still: StoryStill | null;
  schematic: "connect" | "system";
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div className={flip ? "md:order-2" : undefined}>{children}</div>
      <div aria-hidden className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-card">
        {still ? (
          <Image src={still.src} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" style={{ objectPosition: still.focus }} />
        ) : (
          <Schematic variant={schematic} />
        )}
      </div>
    </div>
  );
}

function ChapterText({ chapter }: { chapter: (typeof storyChapters)[number] }) {
  return (
    <>
      <p className="label-mono">{chapter.label}</p>
      <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">{chapter.heading}</h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{chapter.body}</p>
    </>
  );
}
