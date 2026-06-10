import NewsCarousel from "@/components/news/NewsCarousel";
import type { FeedAuthor } from "@/components/campfire/types";
import type { News } from "@/data/news";
import type { EngagementMap } from "@/components/news/types";

// News container directly beneath the Hero. The artwork is the lower
// continuation of the SAME source as the Hero. To avoid a hard mp4↔png seam the
// section overlaps the Hero's bottom and BOTH background layers (the artwork and
// the dark seam veil) share one soft top mask, so they dissolve in from
// transparent over ~80px — the Hero video melts into the artwork with no edge.
// The seam veil darkens the artwork's top to match the Hero's darkened bottom,
// then lifts, giving a soft symmetric transition.
export default function NewsSection({
  items,
  engagement,
  meId,
  meAuthor,
}: {
  items: News[];
  engagement: EngagementMap;
  meId: string | null;
  meAuthor: FeedAuthor | null;
}) {
  if (items.length === 0) return null;

  const fade = "linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 82px)";

  return (
    <section className="relative isolate -mt-[64px] overflow-hidden px-6 pb-24 pt-40 md:px-12 md:pb-32 md:pt-48">
      {/* Artwork + dark base, dissolving in at the top. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/images/news-sky.png')",
          backgroundColor: "#0c0b20",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          WebkitMaskImage: fade,
          maskImage: fade,
        }}
      />
      {/* Seam veil — darkens the artwork's top to match the Hero's bottom, then
          lifts. Shares the same top mask so it has no hard edge of its own. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[460px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,11,34,0.8) 0%, rgba(15,13,40,0.62) 16%, rgba(18,16,44,0.4) 34%, rgba(20,18,48,0.22) 54%, rgba(20,18,48,0.07) 76%, rgba(20,18,48,0) 100%)",
          WebkitMaskImage: fade,
          maskImage: fade,
        }}
      />
      {/* Lower legibility veil for the carousel area. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,11,32,0) 40%, rgba(12,11,32,0.32) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xs uppercase tracking-[0.28em] text-cream/70 md:text-sm [text-shadow:_0_1px_10px_rgba(8,7,24,0.7)]">
            News
          </p>
          <h2 className="mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-cream sm:text-4xl [text-shadow:_0_2px_18px_rgba(8,7,24,0.75)]">
            Fresh from the label.
          </h2>
        </header>

        <div className="mt-12 md:mt-16">
          <NewsCarousel
            items={items}
            initialEngagement={engagement}
            meId={meId}
            meAuthor={meAuthor}
          />
        </div>
      </div>
    </section>
  );
}
