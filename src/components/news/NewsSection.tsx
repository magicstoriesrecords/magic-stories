import NewsCarousel from "@/components/news/NewsCarousel";
import type { FeedAuthor } from "@/components/campfire/types";
import type { News } from "@/data/news";
import type { EngagementMap } from "@/components/news/types";

// News container directly beneath the Hero. The artwork is the lower
// continuation of the SAME source image the Hero was built from, so we keep the
// image pristine (anchored to the top) and only carry the Hero's magic-hour
// veil across the seam: the dark pool that closes the Hero (ending at
// rgba(16,14,40,0.88)) continues at the top of this section and lifts as you
// scroll in — same gradient family, so the seam reads as one continuous image.
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

  return (
    <section className="relative isolate overflow-hidden px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-40">
      {/* Continuation artwork — anchored to the top so its top row meets the
          Hero's bottom row exactly. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-top"
        style={{ backgroundImage: "url('/images/news-sky.png')", backgroundColor: "#0c0b20" }}
      />
      {/* Seam veil — continues the Hero's magic-hour veil. Starts at the Hero's
          exact closing tone (rgba(16,14,40,0.88)) and lifts to clear, so the
          darkness pooled at the bottom of the Hero flows seamlessly into here. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[420px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,14,40,0.88) 0%, rgba(18,16,44,0.72) 12%, rgba(20,18,48,0.42) 28%, rgba(20,18,48,0.18) 48%, rgba(20,18,48,0) 100%)",
        }}
      />
      {/* Lower legibility veil for the carousel area. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,11,32,0) 55%, rgba(12,11,32,0.3) 100%)",
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
