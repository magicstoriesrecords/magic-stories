import NewsCarousel from "@/components/news/NewsCarousel";
import type { FeedAuthor } from "@/components/campfire/types";
import type { News } from "@/data/news";
import type { EngagementMap } from "@/components/news/types";

// News container directly beneath the Hero. The artwork (news-sky.png,
// 1916×1078) continues the SAME source image as the Hero video, and its top
// 40 rows DUPLICATE the video's bottom 40 rows. The section overlaps the Hero
// by exactly those 40 source pixels AT THE VIDEO'S RENDERED SCALE.
//
// The video is object-cover: scale = max(W/1916, H/1080) with a centred crop.
// The artwork mirrors that exactly:
// - background-size: max(100%, 177.4074svh) auto   (177.4074 = 1916/1080·100)
// - background-position: top center                 (same centred side-crop)
// - overlap margin: max(2.0877%, 3.7037svh)         (40px at the video scale)
// So for EVERY window aspect ratio the band contains identical pixels at an
// identical scale on both sides, and the cross-fade cannot be seen.
//
// Inside the masked stack the Hero's overlays are continued exactly:
// - magic-hour veil ends at rgba(16,14,40,0.74) at the Hero's bottom edge;
//   our linear veil starts there, holds a short plateau (no gradient-reversal
//   "valley"/Mach band at the seam), then eases away over ~560px.
// - the radial headline scrim is re-emitted with the same radii/stops,
//   centred 15.8svh ABOVE our top edge, so its darkness pool crosses the
//   seam unbroken and fades out naturally inside the section.
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

  // Completes slightly inside the overlap band in BOTH cover regimes
  // (width-limited → vw term, height-limited → svh term).
  const fade =
    "linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,1) max(1.9vw, 3.55svh))";

  return (
    <section className="relative isolate -mt-[max(2.0877%,3.7037svh)] overflow-hidden px-6 pb-24 pt-40 md:px-12 md:pb-32 md:pt-48">
      {/* Background stack — masked as ONE unit so video→artwork is a single
          cross-fade of identical content, not layered edges. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ WebkitMaskImage: fade, maskImage: fade }}
      >
        {/* Artwork: mirrors the video's object-cover scale and centred crop.
            Base colour matches the artwork's near-black bottom rows. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/news-sky.png')",
            backgroundColor: "#010105",
            backgroundSize: "max(100%, 177.4074svh) auto",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Continuation of the Hero's magic-hour veil: starts at the exact
            value the Hero ends with, plateaus briefly, then lifts. */}
        <div
          className="absolute inset-x-0 top-0 h-[560px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(16,14,40,0.74) 0%, rgba(16,14,40,0.735) 10%, rgba(17,15,42,0.68) 25%, rgba(18,16,44,0.55) 45%, rgba(19,17,46,0.38) 65%, rgba(19,17,46,0.2) 82%, rgba(19,17,46,0.09) 92%, rgba(19,17,46,0) 100%)",
          }}
        />
        {/* Continuation of the Hero's radial headline scrim (same ellipse,
            centre sits 15.8svh above this section's top). */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 50.4svh at 50% -15.8svh, rgba(14,12,36,0.7) 0%, rgba(14,12,36,0.42) 42%, rgba(14,12,36,0) 74%)",
          }}
        />
      </div>
      {/* Lower legibility veil for the carousel area. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,3,12,0) 40%, rgba(4,3,12,0.35) 100%)",
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
