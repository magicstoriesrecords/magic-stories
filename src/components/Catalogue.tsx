import Image from "next/image";

const releases = [
  {
    image: "/images/ch-015.jpg.jpg",
    chapter: "Chapter 015",
    title: "Sunset At Kamala",
    artist: "Mazze",
  },
  {
    image: "/images/ch-014.jpg.jpg",
    chapter: "Chapter 014",
    title: "Feathers",
    artist: "Mira Lune",
  },
  {
    image: "/images/ch-013.jpg",
    chapter: "Chapter 013",
    title: "Mirra",
    artist: "Mira Lune",
  },
  {
    image: "/images/ch-012.jpg",
    chapter: "Chapter 012",
    title: "Face",
    artist: "Ardent",
  },
];

export default function Catalogue() {
  return (
    <section className="px-8 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 font-serif text-4xl">The Catalogue</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {releases.map((release) => (
            <a
              key={release.chapter}
              href="#"
              className="group transition hover:opacity-80"
            >
              <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-lg">
                <Image
                  src={release.image}
                  alt={`${release.title} — ${release.chapter}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                />
              </div>
              <p className="mb-1 text-xs uppercase tracking-widest opacity-60">
                {release.chapter}
              </p>
              <h3 className="font-serif text-xl">{release.title}</h3>
              <p className="mt-1 text-xs opacity-60">by {release.artist}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
