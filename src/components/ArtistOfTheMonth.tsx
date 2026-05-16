import Image from "next/image";

export default function ArtistOfTheMonth() {
  return (
    <section className="px-8 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src="/images/artist-mazze.jpg"
            alt="Mazze — Artist of the Month"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-xs uppercase tracking-widest opacity-60">
            Artist of the Month
          </p>
          <h2 className="font-serif text-5xl">Mazze</h2>
          <p className="leading-relaxed opacity-80">
            Mazze is the atmospheric heart behind Magic Stories Records — a DJ
            and producer who sculpts space from silence, letting every kick and
            pad breathe like tide on sand. Based in Szczecin, he draws from the
            Baltic coast and late-night city lights to build sets that feel less
            like performance and more like shared memory.
          </p>
          <p className="leading-relaxed opacity-80">
            His sound sits at the intersection of melodic deep house and organic
            house: warm basslines, brushed percussion, and melodies that unfold
            slowly enough to notice the dusk between notes. On MSR, Mazze is both
            curator and compass — the voice that reminds us why we listen when
            the day finally lets go.
          </p>
          <a
            href="#"
            className="mt-2 text-sm transition hover:opacity-60"
          >
            Discover Mazze →
          </a>
        </div>
      </div>
    </section>
  );
}
