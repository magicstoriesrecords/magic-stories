import NewsCarousel from "@/components/news/NewsCarousel";
import type { FeedAuthor } from "@/components/campfire/types";
import type { News } from "@/data/news";
import type { EngagementMap } from "@/components/news/types";

// News container that sits directly beneath the Hero. Its night-sky artwork
// (public/images/news-sky.png) blends into the dark base of the Hero video via
// a seam gradient at the top, so the video appears to melt into the section.
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
    <section className="relative isolate overflow-hidden px-6 pb-24 pt-20 md:px-12 md:pb-32 md:pt-28">
      {/* Night-sky artwork backdrop. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/news-sky.png')", backgroundColor: "#100e28" }}
      />
      {/* Seam — melts the top of the section into the dark base of the Hero. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-44"
        style={{
          background:
            "linear-gradient(180deg, #100e28 0%, rgba(16,14,40,0.7) 38%, rgba(16,14,40,0) 100%)",
        }}
      />
      {/* Gentle legibility veil over the artwork. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#100e28]/30" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xs uppercase tracking-[0.28em] text-cream/70 md:text-sm">
            News
          </p>
          <h2 className="mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-cream sm:text-4xl">
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
