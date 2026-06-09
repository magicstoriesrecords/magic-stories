import NewsCarousel from "@/components/news/NewsCarousel";
import type { FeedAuthor } from "@/components/campfire/types";
import type { News } from "@/data/news";
import type { EngagementMap } from "@/components/news/types";

// News container directly beneath the Hero. The artwork is the lower
// continuation of the SAME source as the Hero, so for a seamless seam:
//   • the Hero video is scaled by WIDTH (object-cover) and anchored to its
//     BOTTOM edge (object-bottom);
//   • this artwork is scaled by WIDTH too (background-size: 100% auto) and
//     anchored to its TOP edge — identical horizontal scale ⇒ the video's
//     bottom row meets the artwork's top row at the same magnification.
// The artwork must be exported at the SAME WIDTH as the video (1916 px) with
// its top edge continuing the video's bottom edge. The Hero's magic-hour veil
// is then carried across the seam to absorb the warm→cool tonal shift.
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
      {/* Continuation artwork — scaled by width (matches the Hero video's
          width-cover) and anchored to the top so its top row meets the Hero's
          bottom row. Any area below the image falls back to the night colour. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/images/news-sky.png')",
          backgroundColor: "#0c0b20",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Seam veil — continues the Hero's magic-hour veil. Starts at the Hero's
          exact closing tone (rgba(16,14,40,0.88)) and lifts to clear. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[420px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,12,36,0.97) 0%, rgba(14,12,36,0.95) 3%, rgba(16,14,40,0.82) 12%, rgba(18,16,44,0.5) 26%, rgba(20,18,48,0.26) 44%, rgba(20,18,48,0.08) 66%, rgba(20,18,48,0) 100%)",
        }}
      />
      {/* Lower legibility veil for the carousel area. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,11,32,0) 55%, rgba(12,11,32,0.34) 100%)",
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
