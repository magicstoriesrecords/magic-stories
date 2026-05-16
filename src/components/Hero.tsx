import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen px-8 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl min-h-[calc(100vh-8rem)] items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col justify-center gap-8">
          <p className="text-xs uppercase tracking-widest opacity-60">
            Chapter 015
          </p>
          <h1 className="font-serif text-5xl leading-tight md:text-6xl">
            Sunset At Kamala
          </h1>
          <p className="max-w-md text-base leading-relaxed opacity-80">
            Evening settles over the coast like a slow exhale, the sky bleeding
            amber and rose into the horizon. Warm air carries salt and distant
            laughter while the sea breathes against the shore in long, patient
            waves — the kind of magic hour where every sound feels painted in
            gold.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#"
              className="rounded-full border border-black px-8 py-3 text-sm transition hover:opacity-60"
            >
              Listen
            </a>
            <a
              href="#"
              className="text-sm transition hover:opacity-60"
            >
              Read the story →
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
          <Image
            src="/images/hero.jpg"
            alt="Sunset At Kamala — featured chapter artwork"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
