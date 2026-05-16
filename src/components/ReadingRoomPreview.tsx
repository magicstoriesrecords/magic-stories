const posts = [
  {
    format: "STORY",
    title: "An afternoon in Kamala",
    excerpt:
      "The beach was almost empty when we arrived, just a few fishermen pulling in their nets. We sat on warm sand and listened to the tide until the light turned honey-gold.",
    author: "Mazze",
    date: "May 2026",
    bg: "bg-black/5",
  },
  {
    format: "VISUAL",
    title: "Studio session #3",
    excerpt:
      "Analog warmth meets digital precision in our Szczecin studio — cables, coffee, and the slow hunt for the perfect pad. These frames capture the in-between moments.",
    author: "Mira Lune",
    date: "April 2026",
    bg: "bg-black/[0.03]",
  },
  {
    format: "SOUND",
    title: "Why we listen at dusk",
    excerpt:
      "There is a frequency the world hits just before dark — softer, more forgiving. We built MSR around that hour, when melody feels like memory returning.",
    author: "Ardent",
    date: "March 2026",
    bg: "bg-black/5",
  },
];

export default function ReadingRoomPreview() {
  return (
    <section className="px-8 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 font-serif text-4xl">Reading Room</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className={`flex flex-col rounded-lg border border-black/10 p-6 ${post.bg}`}
            >
              <p className="mb-4 text-xs uppercase tracking-widest opacity-60">
                {post.format}
              </p>
              <h3 className="mb-4 font-serif text-2xl">{post.title}</h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed opacity-80">
                {post.excerpt}
              </p>
              <p className="text-xs opacity-60">
                by {post.author} · {post.date}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
